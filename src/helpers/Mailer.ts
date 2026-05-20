import nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { CreateEmailResponse, Resend } from 'resend';



class Mailer {
    public transporter: nodemailer.Transporter<SentMessageInfo, Options>;
    private resend: Resend;

    Send (data: {
        to: string;
        subject: string;
        html: string;
    }): Promise<CreateEmailResponse> {
        if (!this.resend) {
            this.resend = new Resend(process.env.RESEND_KEY);
        };

        return this.resend.emails.send({
            from: 'Oomfy <no-reply@oomfy.online>',
            to: data.to,
            subject: data.subject,
            html: data.html
        });
    };
};

export default new Mailer();