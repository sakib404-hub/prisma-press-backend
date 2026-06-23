import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const config = {
  port: process.env.PORT || 3000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  app_url: process.env.APP_URL,
  jwt_secret: process.env.JWT_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_access_token_expiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION!,
  jwt_refresh_token_expiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION!,
};

export default config;