// src/services/ai.service.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../config/database.config";

export class AIService {
  private extractKeywords(text: string): string[] {
    const stopwords = new Set([
      'yang', 'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'dengan', 
      'dan', 'atau', 'ini', 'itu', 'juga', 'sudah', 'saya', 'dia', 
      'mereka', 'kita', 'kami', 'kamu', 'ada', 'adalah', 'akan', 
      'bisa', 'dapat', 'tidak', 'bukan', 'belum', 'apa', 'bagaimana',
      'kenapa', 'mengapa', 'kapan', 'siapa', 'dimana', 'tolong', 'bantu',
      'cara', 'perbaiki', 'mengatasi'
    ]);
    
    // Hapus tanda baca dan ubah ke lowercase
    const cleaned = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleaned.split(/\s+/);
    
    // Filter kata yang bukan stopword dan panjang > 2
    return words.filter(word => word.length > 2 && !stopwords.has(word));
  }

  private async searchRelevantHistory(keywords: string[]) {
    if (keywords.length === 0) return [];

    try {
      // Cari WorkOrder yang memiliki keluhan (customerComplaints) atau catatan mekanik (mechanicNotes)
      // yang mengandung salah satu kata kunci. Kita gunakan contains query dari Prisma.
      const orConditions = keywords.flatMap(kw => [
        { customerComplaints: { contains: kw } },
        { mechanicNotes: { contains: kw } }
      ]);

      const history = await prisma.workOrder.findMany({
        where: {
          status: 'COMPLETED',
          OR: orConditions
        },
        take: 5,
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          vehicle: {
            select: { brand: true, model: true }
          },
          services: {
            include: { service: true }
          },
          spareparts: {
            include: { sparepart: true }
          }
        }
      });

      return history;
    } catch (error) {
      console.error("Error searching history:", error);
      return [];
    }
  }

  async chat(message: string, userId: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return "Fitur AI Chat belum dikonfigurasi. Silakan masukkan GEMINI_API_KEY yang valid di file .env backend dan restart server.";
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      // 1. Dapatkan statistik dashboard
      let stats = { todayWorkOrders: 0, activeWorkOrders: 0, lowStockCount: 0 };
      try {
        stats = await this.getDashboardContext();
      } catch (dbError) {
        console.error("⚠️ Dashboard context failed:", dbError);
      }

      // 2. Ekstrak Keyword & Cari Riwayat SPK (RAG)
      const keywords = this.extractKeywords(message);
      const history = await this.searchRelevantHistory(keywords);

      let historyContext = "";
      if (history.length > 0) {
        historyContext = "\n\nRIWAYAT PERBAIKAN SEBELUMNYA (Konteks RAG):\n";
        history.forEach((wo, index) => {
          const vehicle = `${wo.vehicle?.brand} ${wo.vehicle?.model}`;
          const services = wo.services.map(s => s.service.name).join(", ") || "-";
          const spareparts = wo.spareparts.map(sp => sp.sparepart.name).join(", ") || "-";
          
          historyContext += `${index + 1}. Kendaraan: ${vehicle}
   Keluhan: ${wo.customerComplaints || '-'}
   Tindakan Mekanik: ${wo.mechanicNotes || '-'}
   Jasa: ${services}
   Sparepart Diganti: ${spareparts}\n\n`;
        });
      }

      // 3. Susun System Instruction
      const systemInstruction = `Anda adalah AutoService AI Assistant untuk bengkel "AutoServis". Tugas Anda adalah membantu admin, mekanik, atau pimpinan bengkel dalam menjawab pertanyaan operasional dan teknis.

Konteks Bengkel Saat Ini:
- Order Hari Ini: ${stats.todayWorkOrders}
- Pekerjaan Aktif: ${stats.activeWorkOrders}
- Stok Kritis: ${stats.lowStockCount} item${historyContext}

Aturan Menjawab:
1. Berikan jawaban singkat, akurat, profesional, dan dalam Bahasa Indonesia.
2. Jika ada riwayat perbaikan yang relevan pada bagian "RIWAYAT PERBAIKAN SEBELUMNYA", gunakan data tersebut untuk memberikan rekomendasi spesifik (misal: "Berdasarkan riwayat bengkel ini, keluhan X sering diselesaikan dengan mengganti part Y").
3. Jika pertanyaan tidak relevan dengan otomotif atau sistem bengkel, arahkan kembali ke topik otomotif secara sopan.`;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction,
      });

      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error("Empty response from Gemini");
      return text;

    } catch (error: any) {
      console.error("❌ AI Error Details:", JSON.stringify(error, null, 2));

      const errorMsg = (error.message || "") + JSON.stringify(error?.errorDetails || "");
      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('400')) {
        return "API Key Gemini tidak valid. Silakan periksa nilai GEMINI_API_KEY di file .env backend.";
      }
      if (errorMsg.includes('SAFETY')) {
        return "Maaf, permintaan Anda diblokir oleh filter keamanan AI.";
      }
      if (errorMsg.includes('quota') || errorMsg.includes('429')) {
        return "Batas penggunaan (quota) AI telah habis. Silakan coba lagi nanti.";
      }
      if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('network')) {
        return "Backend tidak dapat terhubung ke server Google AI. Periksa koneksi internet server Anda.";
      }

      return `Terjadi kesalahan: ${error.message || "Unknown error"}`;
    }
  }

  private async getDashboardContext() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Use raw query to compare stockQuantity <= minStock (two columns)
      const [todayWorkOrders, activeWorkOrders, lowStockResult] = await Promise.all([
        prisma.workOrder.count({ where: { createdAt: { gte: today } } }),
        prisma.workOrder.count({ where: { status: { in: ['IN_PROGRESS', 'WAITING_PARTS'] } } }),
        prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count FROM spareparts 
          WHERE stock_quantity <= min_stock AND is_active = 1
        `
      ]);

      return {
        todayWorkOrders,
        activeWorkOrders,
        lowStockCount: Number(lowStockResult[0]?.count || 0)
      };
    } catch (error) {
      console.error("getDashboardContext error:", error);
      return { todayWorkOrders: 0, activeWorkOrders: 0, lowStockCount: 0 };
    }
  }
}

export const aiService = new AIService();
