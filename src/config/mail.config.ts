// src/core/config/mail.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  /**
   * Mail provider driver (e.g. 'smtp', 'sendgrid', 'mailgun')
   */
  driver: process.env.MAIL_DRIVER || 'smtp',

  /**
   * SMTP credentials
   */
  smtp: {
    host: process.env.MAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
    secure: process.env.MAIL_SECURE === 'true', // true = SSL
  },

  /**
   * Default sender info
   */
  from: {
    name: process.env.MAIL_FROM_NAME || 'System Notification',
    address: process.env.MAIL_FROM_ADDRESS || 'noreply@example.com',
  },

  /**
   * Optional rate limit (emails per minute/hour)
   */
  rateLimit: {
    maxPerMinute: parseInt(process.env.MAIL_MAX_PER_MINUTE, 10) || 60,
    maxPerHour: parseInt(process.env.MAIL_MAX_PER_HOUR, 10) || 1000,
  },
}));

/*
📦 Purpose: Central config for sending emails — supports SMTP credentials, sender name, rate limits, and provider customization.

🧠 Why It Matters
Centralized and environment-safe config for all outgoing email

Easy to switch between providers (Gmail, Mailgun, SendGrid, etc.)

Enables per-environment throttling (dev vs prod)

⚙️ Example Usage in a Mail Service
ts

@Injectable()
export class MailService {
  constructor(
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  async sendWelcomeEmail(to: string) {
    const fromName = this.config.get<string>('mail.from.name');
    const fromEmail = this.config.get<string>('mail.from.address');

    await this.mailer.sendMail({
      to,
      from: `"${fromName}" <${fromEmail}>`,
      subject: 'Welcome!',
      template: 'welcome',
      context: {
        user: to,
      },
    });
  }
}
🔄 Provider Switching Strategy
Use mail.driver to customize the provider implementation. For example:

ts

const driver = config.get<'smtp' | 'sendgrid' | 'mailgun'>('mail.driver');

if (driver === 'sendgrid') {
  // Use SendGrid client instead of SMTP
}
✅ Summary of Config Keys

Key	Description
mail.driver	Provider selection (e.g., smtp)
mail.smtp.host	SMTP server host
mail.smtp.port	SMTP server port
mail.smtp.user / pass	SMTP credentials
mail.from	Default sender info
mail.rateLimit	Optional throttle controls
*/