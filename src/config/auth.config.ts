// src/core/config/auth.config.ts

import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  /**
   * JWT secret key (must be strong and kept secure in production)
   */
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',

  /**
   * JWT expiration time for access tokens (e.g., '15m', '1h')
   */
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',

  /**
   * JWT expiration time for refresh tokens (e.g., '7d')
   */
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  /**
   * Bcrypt salt rounds (used for hashing passwords)
   */
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

  /**
   * Optional: Token issuer and audience (for validation)
   */
  jwtIssuer: process.env.APP_ || 'dtl-boilerplate',
  jwtAudience: process.env.JWT_AUDIENCE || 'dtl-users',

  /**
   * Optional: Enable/disable refresh token rotation
   */
  refreshTokenRotation: process.env.JWT_REFRESH_ROTATION === 'true',
}));


/*
⚙️ How to Use
1️⃣ In JwtModule (for AuthModule)
ts

// src/modules/auth/auth.module.ts

JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>('auth.jwtSecret'),
    signOptions: {
      expiresIn: config.get<string>('auth.jwtExpiresIn'),
      issuer: config.get<string>('auth.jwtIssuer'),
      audience: config.get<string>('auth.jwtAudience'),
    },
  }),
});
2️⃣ In your token service
ts

const token = this.jwtService.sign(payload, {
  secret: this.config.get<string>('auth.jwtSecret'),
  expiresIn: this.config.get<string>('auth.jwtExpiresIn'),
});
3️⃣ For password hashing
ts

import * as bcrypt from 'bcrypt';

const saltRounds = this.config.get<number>('auth.bcryptSaltRounds');
const hash = await bcrypt.hash(password, saltRounds);


*/
