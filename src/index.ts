/// <reference path="../env.d.ts" />

import dotenv from 'dotenv';
import Server from "./Server";

dotenv.config();
new Server(Number(process.env.PORT));