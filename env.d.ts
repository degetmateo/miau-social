import { Request } from 'express';

declare module 'express' {
  interface Request {
    member?: { 
      id: number; 
      username: string;
      role: string;
    };
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
      }
    }
  }

export {};