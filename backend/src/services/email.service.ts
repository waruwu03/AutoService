import nodemailer from 'nodemailer';
import { env } from 'process';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password',
      },
    });
  }

  async sendInvoiceEmail(to: string, invoiceNumber: string, pdfBuffer: Buffer) {
    try {
      const mailOptions = {
        from: `"AutoServis" <${process.env.SMTP_USER || 'no-reply@autoservis.com'}>`,
        to,
        subject: `Invoice #${invoiceNumber} dari AutoServis`,
        text: `Halo,\n\nTerlampir adalah invoice ${invoiceNumber} untuk layanan perbaikan kendaraan Anda di AutoServis.\n\nTerima kasih telah mempercayakan kendaraan Anda kepada kami!\n\nSalam,\nTim AutoServis`,
        html: `<p>Halo,</p><p>Terlampir adalah invoice <strong>${invoiceNumber}</strong> untuk layanan perbaikan kendaraan Anda di AutoServis.</p><p>Terima kasih telah mempercayakan kendaraan Anda kepada kami!</p><br><p>Salam,</p><p><strong>Tim AutoServis</strong></p>`,
        attachments: [
          {
            filename: `Invoice_${invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email invoice sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Failed to send invoice email:', error);
      throw new Error('Gagal mengirim email invoice');
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    try {
      // Typically the URL would be configured via env var, pointing to the frontend reset page
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"AutoServis" <${process.env.SMTP_USER || 'no-reply@autoservis.com'}>`,
        to,
        subject: `Reset Password Anda - AutoServis`,
        text: `Anda menerima email ini karena Anda (atau seseorang) meminta reset password.\n\nSilakan klik link berikut untuk mereset password Anda: \n${resetUrl}\n\nJika Anda tidak meminta ini, abaikan email ini.`,
        html: `<p>Anda menerima email ini karena Anda (atau seseorang) meminta reset password.</p><p>Silakan klik link berikut untuk mereset password Anda:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Jika Anda tidak meminta ini, abaikan email ini.</p>`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email reset password sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      throw new Error('Gagal mengirim email reset password');
    }
  }
}

export const emailService = new EmailService();
