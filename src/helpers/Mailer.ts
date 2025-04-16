import nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

class Mailer {
    public transporter: nodemailer.Transporter<SentMessageInfo, Options>;

    Send (data: {
        to: string;
        subject: string;
        html: string;
    }): Promise<SentMessageInfo> {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAILER_USER,
                    pass: process.env.MAILER_PASSWORD
                }
            });
        }

        return new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: process.env.MAILER_USER,
                to: data.to,
                subject: data.subject,
                html: data.html
            }, (error: Error, info: SentMessageInfo) => {
                error ? 
                    reject(error.message) :
                    resolve(info);
            });
        });
    }
}

export default new Mailer();