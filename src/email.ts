import nodemailer from 'nodemailer';
import path from 'path';
import { log, error as logError } from './logger';

export class EmailService {
    private transporter;
    private fromEmail: string;

    constructor() {
        this.fromEmail = process.env.SMTP_FROM || 'bhargavagonugunta123@gmail.com';
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendEmailWithAttachments(to: string, subject: string, text: string, attachmentPaths: string[]) {
        if (!process.env.SMTP_HOST) {
            log('SMTP_HOST not set. Mocking email send.');
            log(`To: ${to}, Subject: ${subject}, Attachments: ${attachmentPaths.join(', ')}`);
            return;
        }

        try {
            const attachments = attachmentPaths.map(p => ({
                filename: path.basename(p),
                path: p
            }));

            const info = await this.transporter.sendMail({
                from: this.fromEmail,
                to,
                subject,
                text,
                attachments
            });
            log(`Message sent: ${info.messageId}`);
        } catch (error) {
            logError('Error sending email:', error);
            throw error;
        }
    }
}
