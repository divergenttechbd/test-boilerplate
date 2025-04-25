import { registerAs } from '@nestjs/config';

export default registerAs('external-api', () => ({
  /**
   * Third-Party API Configurations
   */
  apiServices: {
    /*
    paymentGateway: {
      baseUrl: process.env.PAYMENT_GATEWAY_URL || 'https://api.paymentgateway.com',
      apiKey: process.env.PAYMENT_GATEWAY_API_KEY || '', // API Key for the payment gateway
      timeout: parseInt(process.env.PAYMENT_GATEWAY_TIMEOUT, 10) || 5000, // Timeout in ms for API requests
      retryAttempts: parseInt(process.env.PAYMENT_GATEWAY_RETRY_ATTEMPTS, 10) || 3, // Retry attempts for failed requests
      retryDelay: parseInt(process.env.PAYMENT_GATEWAY_RETRY_DELAY, 10) || 1000, // Delay between retry attempts in ms
    },
    weatherService: {
      baseUrl: process.env.WEATHER_SERVICE_URL || 'https://api.weather.com',
      apiKey: process.env.WEATHER_SERVICE_API_KEY || '',
      timeout: parseInt(process.env.WEATHER_SERVICE_TIMEOUT, 10) || 5000,
      retryAttempts: parseInt(process.env.WEATHER_SERVICE_RETRY_ATTEMPTS, 10) || 3,
      retryDelay: parseInt(process.env.WEATHER_SERVICE_RETRY_DELAY, 10) || 1000,
    },
    */
    // Add other external APIs here...
  },

  /**
   * Global settings for all external APIs
   */
  global: {
    defaultTimeout: parseInt(process.env.EXTERNAL_API_TIMEOUT, 10) || 5000, // Default timeout for all external APIs
    maxRetryAttempts: parseInt(process.env.EXTERNAL_API_RETRY_ATTEMPTS, 10) || 3, // Max retry attempts
    retryDelay: parseInt(process.env.EXTERNAL_API_RETRY_DELAY, 10) || 1000, // Retry delay in ms
    enableLogging: process.env.EXTERNAL_API_LOGGING === 'true', // Enable or disable logging of external API calls
  },
}));
