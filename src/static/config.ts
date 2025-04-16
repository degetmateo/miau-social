import { loadEnvFile } from 'node:process';

loadEnvFile();

export const {
    FRONTEND_URL,
    JWT_KEY,
    PORT,
    POSTGRES_DB_NAME,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_URL,
    POSTGRES_USERNAME,
    TENOR_KEY,
    RECAPTCHA_KEY,
    MAILER_PASSWORD,
    MAILER_USER
} = process.env;