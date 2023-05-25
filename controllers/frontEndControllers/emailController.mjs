import dotenv from 'dotenv';
import sendgrid from '@sendgrid/mail';
import * as DatabaseClient from "../../model/databaseClient.mjs";
import { ApiControllers } from "../index.mjs";
import fs from "fs/promises";

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

    static async previewEmail(req, res) {
        try {
            const client = await DatabaseClient.createConnection();
            // const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
            const account = {firstName: "Christos"};
            const hotel = await ApiControllers.HotelController.returnHotel(client);
            await DatabaseClient.endConnection(client);

            res.render(
                "emails/accountCreation",
                {
                    layout: "spinnerLayout",
                    title: "Account Creation",
                    hotel: hotel,
                    account: account,
                    logo_source: `data:image/png;base64,` + (await fs.readFile("./public/assets/aegean-blue-hotel-logo-wide.png")).toString("base64")
                }
            )
        }
        catch (err) {
            // next(err);
            console.log(err);
        }
    }
}

export { EmailController }