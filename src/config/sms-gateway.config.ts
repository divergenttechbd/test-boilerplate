// src/core/config/sms-gateway.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  /**
   * SMS driver/provider
   * Options: 'twilio', 'nexmo', 'custom'
   */
  driver: process.env.SMS_DRIVER || 'twilio',

  /**
   * Twilio configuration
   */
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    from: process.env.TWILIO_PHONE_NUMBER || '',
  },

  /**
   * Nexmo/Vonage configuration
   */
  nexmo: {
    apiKey: process.env.NEXMO_API_KEY || '',
    apiSecret: process.env.NEXMO_API_SECRET || '',
    from: process.env.NEXMO_PHONE_NUMBER || '',
  },

  /**
   * Custom gateway configuration (API URL + Auth)
   */
  custom: {
    apiUrl: process.env.CUSTOM_SMS_API_URL || '',
    authKey: process.env.CUSTOM_SMS_AUTH_KEY || '',
    from: process.env.CUSTOM_SMS_SENDER_ID || '',
  },

  /**
   * Optional fallback driver in case of failure
   */
  fallbackDriver: process.env.SMS_FALLBACK_DRIVER || 'nexmo',

  /**
   * Retry limit for sending SMS
   */
  retryLimit: parseInt(process.env.SMS_RETRY_LIMIT, 10) || 2,
}));

/*
📦 Purpose: Configuration for SMS gateway service integration. Supports dynamic provider selection (Twilio, Nexmo, Custom) and fallback support.

🧠 Why It Matters
Enables event-based SMS notifications (OTP, alerts)

Supports multiple providers with failover logic

Keeps credentials and endpoints secure and environment-specific

⚙️ Example Usage in an SMS Service
ts

@Injectable()
export class SmsService {
  constructor(private readonly config: ConfigService) {}

  async sendSms(to: string, message: string) {
    const driver = this.config.get<'twilio' | 'nexmo' | 'custom'>('sms.driver');
    const fallback = this.config.get<string>('sms.fallbackDriver');

    try {
      // send via primary driver
      await this.sendVia(driver, to, message);
    } catch (e) {
      // log error and try fallback if configured
      if (fallback && fallback !== driver) {
        await this.sendVia(fallback, to, message);
      } else {
        throw e;
      }
    }
  }

  private async sendVia(driver: string, to: string, message: string) {
    // Example only — should implement driver-specific logic
  }
}
✅ Summary of Config Keys

Key	Purpose
sms.driver	Primary SMS provider
sms.fallbackDriver	Optional fallback provider
sms.retryLimit	Number of retries
sms.twilio.*	Twilio config
sms.nexmo.*	Nexmo config
sms.custom.*	Custom API-based config

*/
