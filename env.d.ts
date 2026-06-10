import { Request } from 'express';

declare module 'express' {
  interface Request {
    member?: { 
      id: string; 
      username: string;
      role: string;
      email: string;
    };
    clientIp: string;
  }
}

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        POSTGRES_URL: string;
        POSTGRES_PORT: number;
        POSTGRES_DB_NAME: string;
        POSTGRES_USERNAME: string;
        POSTGRES_PASSWORD: string;
        JWT_KEY: string;
        FRONTEND_URL: string;
        PORT: number;
        TENOR_KEY: string;
        RECAPTCHA_KEY: string;
        MAILER_PASSWORD: string;
        MAILER_USER: string;
        PRODUCTION: "TRUE" | "FALSE";
        ENV: "dev" | "prod";

        PG_DATABASE_URI: string;
        PG_DATABASE_CA: string;

        MONGODB_DATABASE_KEY: string;
        MONGODB_DATABASE_NAME: string;


      }
    }
  }

export {};