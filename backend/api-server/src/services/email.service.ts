/**
 * Email Service using Nodemailer
 * Handles all email notifications
 */

import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter configuration
transporter.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const html = await loadTemplate(options.template, options.data || {});

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html
    });

    console.log(`📧 Email sent to ${options.to}: ${options.subject}`);
  } catch (error) {
    console.error('Email send error:', error);
    // Don't throw - email failures shouldn't break the main flow
  }
}

/**
 * Load email template
 */
async function loadTemplate(templateName: string, data: Record<string, any>): Promise<string> {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    let html = await fs.readFile(templatePath, 'utf-8');

    // Replace placeholders
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key]);
    });

    return html;
  } catch (error) {
    console.error('Template load error:', error);
    // Return basic HTML if template fails
    return getBasicTemplate(data);
  }
}

/**
 * Fallback basic template
 */
function getBasicTemplate(data: Record<string, any>): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VNC Blockchain</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
        }
        .footer {
          background: #f9f9f9;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>VNC Blockchain</h1>
        </div>
        <div class="content">
          ${JSON.stringify(data, null, 2)}
        </div>
        <div class="footer">
          <p>&copy; 2026 VNC Blockchain. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Welcome to VNC Blockchain!',
    template: 'welcome',
    data: { name }
  });
}

/**
 * Send deposit success email
 */
export async function sendDepositSuccessEmail(
  to: string,
  name: string,
  amount: number,
  orderId: string
): Promise<void> {
  await sendEmail({
    to,
    subject: 'Deposit Successful',
    template: 'deposit-success',
    data: {
      name,
      amount: `₹${amount.toLocaleString('en-IN')}`,
      orderId,
      date: new Date().toLocaleString()
    }
  });
}

/**
 * Send 2FA enabled notification
 */
export async function send2FAEnabledEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: '2FA Enabled on Your Account',
    template: '2fa-enabled',
    data: { name }
  });
}
