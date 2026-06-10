import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST', 'smtp.gmail.com'),
      port: this.config.get<number>('MAIL_PORT', 587),
      secure: false,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendQuoteNotification(quote: {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    serviceType?: string;
    message?: string;
    craneName?: string;
  }) {
    const adminEmail = this.config.get('MAIL_ADMIN');
    const from = this.config.get('MAIL_FROM', 'contact@soloma.sn');

    // Email à l'admin
    await this.transporter.sendMail({
      from,
      to: adminEmail,
      subject: `[SOLOMA] Nouvelle demande de devis — ${quote.fullName}`,
      html: `
        <h2>Nouvelle demande de devis</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Nom</td><td style="padding:8px;border:1px solid #ddd">${quote.fullName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${quote.email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Téléphone</td><td style="padding:8px;border:1px solid #ddd">${quote.phone || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Entreprise</td><td style="padding:8px;border:1px solid #ddd">${quote.company || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Service</td><td style="padding:8px;border:1px solid #ddd">${quote.serviceType}</td></tr>
          ${quote.craneName ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Grue</td><td style="padding:8px;border:1px solid #ddd">${quote.craneName}</td></tr>` : ''}
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${quote.message || '—'}</td></tr>
        </table>
      `,
    });

    // Email de confirmation au client
    await this.transporter.sendMail({
      from,
      to: quote.email,
      subject: 'SOLOMA SUARL — Votre demande de devis a bien été reçue',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0A1628;padding:24px;text-align:center">
            <h1 style="color:#ffffff;margin:0;font-size:24px">SOLOMA SUARL</h1>
            <p style="color:#E8601C;margin:8px 0 0">Manutention Portuaire & Levage Industriel</p>
          </div>
          <div style="padding:32px;background:#f4f6f9">
            <p>Bonjour <strong>${quote.fullName}</strong>,</p>
            <p>Nous avons bien reçu votre demande de devis. Notre équipe vous contactera dans les plus brefs délais.</p>
            <div style="background:#ffffff;padding:16px;border-left:4px solid #E8601C;margin:24px 0">
              <p style="margin:0;color:#666">Service demandé : <strong>${quote.serviceType}</strong></p>
            </div>
            <p>Pour toute urgence, contactez-nous directement :</p>
            <p><strong>📞 Téléphone :</strong> +221 XX XXX XX XX<br>
            <strong>💬 WhatsApp :</strong> +221 XX XXX XX XX</p>
          </div>
          <div style="background:#0A1628;padding:16px;text-align:center">
            <p style="color:#666;margin:0;font-size:12px">© 2025 SOLOMA SUARL — Dakar, Sénégal</p>
          </div>
        </div>
      `,
    });

    this.logger.log(`Devis envoyé pour ${quote.email}`);
  }

  async sendContactNotification(contact: {
    fullName: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    const adminEmail = this.config.get('MAIL_ADMIN');
    const from = this.config.get('MAIL_FROM', 'contact@soloma.sn');

    await this.transporter.sendMail({
      from,
      to: adminEmail,
      subject: `[SOLOMA] Nouveau message — ${contact.subject || contact.fullName}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>De :</strong> ${contact.fullName} (${contact.email})</p>
        <p><strong>Téléphone :</strong> ${contact.phone || '—'}</p>
        <p><strong>Sujet :</strong> ${contact.subject || '—'}</p>
        <hr/>
        <p>${contact.message}</p>
      `,
    });

    this.logger.log(`Contact reçu de ${contact.email}`);
  }
}
