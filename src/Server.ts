import express from "express";
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import Postgres from "./database/Postgres";
import memberRouter from "./routes/memberRouter";
import authenticationRouter from "./routes/authenticationRouter";
import postRouter from "./routes/postRouter";
import notificationRouter from "./routes/notificationRouter";
import upvoteRouter from "./routes/upvoteRouter";
import followRouter from "./routes/followRouter";
import adminRouter from "./routes/adminRouter";

export default class Server {
    private readonly port: number;
    public readonly app: express.Express;
    public readonly router: express.Router;

    private readonly paths = {
        admin: '/api/admin',
        authentication: '/api/authentication',
        post: '/api/post',
        member: '/api/member',
        notification: '/api/notification',
        upvote: '/api/upvote',
        follow: '/api/follow'
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
        this.app.use(express.json());
        this.app.use(
            cors({
              origin: process.env.FRONTEND_URL
            })
        );
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