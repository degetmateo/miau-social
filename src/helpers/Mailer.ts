import nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { MAILER_USER, MAILER_PASSWORD } from '../static/config';

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
                    user: MAILER_USER,
                    pass: MAILER_PASSWORD
                }
            });
        }

        return new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: MAILER_USER,
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