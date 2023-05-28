import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail';

class EmailController {
    static async sendEmail(email) {
        dotenv.config();
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

        try {
            await sendgrid.send(email);
        }
        catch (err) {
            console.log(err);
        }
    }
}

export { EmailController }