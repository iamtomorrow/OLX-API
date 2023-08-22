
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

export const EmailController = {
    sendEmail: async ( req: Request, res: Response ) => {  
        let transport = nodemailer.createTransport({
        service: "gmail",
        host: "sandbox.smtp.mailtrap.io",
        port: 465, 
        auth: {
            user: "talissonpinholider@gmail.com",
            pass: process.env.SMTP_PASSWORD
        }
        });

        let message = {
            from: "example@email.com",
            to: 'talissonrodriguespinho2001@gmail.com',
            subject: 'Testing email sending',
            text: 'This is my first email sending process!'
        };

        let sending = await transport.sendMail(message);
        console.log(sending);

        res.json({ });
    }
}
