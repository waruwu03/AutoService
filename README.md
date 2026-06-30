# AutoService System 🚗🔧

AutoService adalah aplikasi manajemen operasional bengkel terintegrasi yang dirancang untuk mendigitalisasi proses Surat Perintah Kerja (SPK), manajemen persediaan suku cadang, pencatatan kendaraan dan pelanggan, hingga kasir dan pelaporan finansial bengkel secara *real-time*.

Aplikasi ini menggunakan arsitektur modern *decoupled client-server* dengan API berbasis RESTful.

---

## 🛠️ Tech Stack & Teknologi

Aplikasi dibangun menggunakan kombinasi teknologi modern untuk menjamin performa tinggi, keamanan data, dan skalabilitas:

* **Frontend:**
  * **Framework:** Next.js (TypeScript) dengan React 19
  * **Styling:** Vanilla CSS, TailwindCSS, Tailwind CSS v4, PostCSS, Radix UI & Shadcn/ui
  * **State Management & Fetching:** SWR, Axios
  * **Icons:** Lucide React

* **Backend:**
  * **Core Engine:** Node.js (TypeScript) dengan Express.js
  * **Database ORM:** Prisma ORM
  * **Database Engine:** MySQL 8.0
  * **Caching & Queue:** Redis 7
  * **Object Storage:** MinIO (S3-Compatible Object Storage)
  * **AI Assistance:** Google Gemini AI API SDK

---

## 📁 Struktur Direktori

```bash
AutoService/
├── backend/                  # Kode sumber Backend (Express + Prisma)
│   ├── prisma/               # Skema database & file seeding
│   ├── src/                  # Logika bisnis API (routes, controllers, services)
│   ├── Dockerfile            # Konfigurasi container backend
│   └── package.json
│
├── frontend/                 # Kode sumber Frontend (Next.js App Router)
│   ├── app/                  # Halaman aplikasi (Admin, Mekanik, Gudang, Pimpinan)
│   ├── components/           # Komponen UI reusable (Shadcn/ui)
│   ├── Dockerfile            # Konfigurasi container frontend
│   └── package.json
│
├── docs/                     # Dokumentasi Laporan Proyek Capstone
├── docker-compose.yml        # Orchestration seluruh layanan produksi
├── DEPLOYMENT.md             # Panduan deployment produksi (Nginx, SSL, Docker)
└── README.md                 # Deskripsi umum & petunjuk lokal
```

---

## 💻 Cara Menjalankan Secara Lokal (Development)

Jika ingin mencoba atau mengembangkan aplikasi ini di komputer lokal, ikuti langkah berikut:

### 1. Prasyarat
Pastikan komputer Anda terpasang:
* **Node.js** (v18 atau lebih baru)
* **Docker Desktop** (untuk menjalankan MySQL, Redis, dan MinIO secara instan)

### 2. Jalankan Infrastruktur Pendukung (Database, Redis, MinIO)
Buka terminal di root project dan jalankan docker compose service pendukung:
```bash
docker-compose -f docker-compose.services.yml up -d
```
*MySQL akan berjalan di port `3307`, Redis di port `6379`, dan MinIO Console di port `9001`.*

### 3. Setup Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Duplikat file environment:
   ```bash
   cp .env.example .env
   ```
   *(Sesuaikan isi `.env` jika diperlukan. Secara bawaan sudah diset untuk koneksi ke docker local).*
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan migrasi database dan seed data default:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Jalankan server backend dalam mode development:
   ```bash
   npm run dev
   ```
   *API Server akan berjalan di http://localhost:3002.*

### 4. Setup Frontend
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Duplikat file environment:
   ```bash
   cp .env.example .env
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di http://localhost:3000.*

---

## 🚀 Deployment ke Server Produksi

Untuk melakukan deployment ke server VPS Linux dengan domain publik dan enkripsi SSL (HTTPS), ikuti panduan lengkap yang telah disediakan di file **[DEPLOYMENT.md](file:///g:/Tugas/Tugas%20Proyek%20Perangkat%20Lunak%20%28Capstone%29/AutoService/DEPLOYMENT.md)**.
