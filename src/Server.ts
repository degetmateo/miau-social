import express, { Request, Response } from "express";
import path from 'path';
import cors from 'cors';
import Postgres from "./database/Postgres";
import memberRouter from "./routes/memberRouter";
import authenticationRouter from "./routes/authenticationRouter";
import postRouter from "./routes/postRouter";
import notificationRouter from "./routes/notificationRouter";
import upvoteRouter from "./routes/upvoteRouter";
import followRouter from "./routes/followRouter";
import adminRouter from "./routes/adminRouter";
import tenorRouter from "./routes/tenorRouter";
import sessionRouter from './routes/sessionRouter';
import shareRouter from './routes/shareRouter';

const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PIAU',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        tokenAutorizacion: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  servers: [
    {
      url: "localhost:4000",
      description: 'Development server',
    },
    {
        url: 'https://social-miau.onrender.com'
    }
  ],
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default class Server {
    private readonly port: number;
    public readonly app: express.Express;
    public readonly router: express.Router;

    private readonly paths = {
        docs: '/api/docs',
        admin: '/api/admin',
        authentication: '/api/authentication',
        post: '/api/post',
        member: '/api/member',
        notification: '/api/notification',
        upvote: '/api/upvote',
        follow: '/api/follow',
        tenor: '/api/tenor',
        session: '/api/session',
        share: '/api/share'
    }

    constructor (port: number) {
        try {
            this.port = port as number;
            this.app = express();
            this.app.set('port', this.port);
            
            this.middlewares();
            this.database();
            this.routes();
            this.listen();
        } catch (error) {
            console.error(error);
        }
    }

    private middlewares = () => {
        this.app.use('/public', express.static(path.join(__dirname + '/../public/')));

        this.app.use(requestIp.mw());
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(
            cors({
              origin: process.env.FRONTEND_URL,
              credentials: true
            })
        );

        this.app.use((_, res, next) => {
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.setHeader('Content-Security-Policy',
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com social-miau.onrender.com http://localhost:4000; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com http://localhost:4000; " +
                "img-src 'self' https://www.gstatic.com https://i.ibb.co https://media.tenor.com https://animesher.com https://pbs.twimg.com https://social-miau.onrender.com http://localhost:4000 blob: data:; " +
                "connect-src 'self' https://www.google.com data:; " +
                "frame-src https://www.google.com;"
              );
            next();
        });
    }

    private database = () => {
        Postgres.init();
    }

    private routes = () => {
        this.app.use(this.paths.authentication, authenticationRouter);
        this.app.use(this.paths.member, memberRouter);
        this.app.use(this.paths.post, postRouter);
        this.app.use(this.paths.notification, notificationRouter);
        this.app.use(this.paths.upvote, upvoteRouter);
        this.app.use(this.paths.follow, followRouter);
        this.app.use(this.paths.admin, adminRouter);
        this.app.use(this.paths.tenor, tenorRouter);
        this.app.use(this.paths.session, sessionRouter);
        this.app.use(this.paths.share, shareRouter);
        this.app.use(this.paths.docs, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        this.app.use('*', (_, res) => {
            res.sendFile(path.join(__dirname + '/../public/app.html'));
        });
    }

    private listen = () =>  {
        this.app.listen(this.port, () => {
            console.log(`🟩 | Servidor escuchando en el Puerto: ${this.port}`);
        });
    }
}