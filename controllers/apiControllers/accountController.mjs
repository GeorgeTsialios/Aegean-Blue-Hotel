import bcrypt from "bcrypt";
import { Account } from "../../model/account.mjs";
import { AccountLevelController } from "./index.mjs";
import { Photo } from "../../model/photo.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";
import { EmailController } from "../frontEndControllers/emailController.mjs";
import * as HotelController from "./hotelController.mjs";

import fs from "fs/promises";
import hbs from 'express-handlebars';

async function checkAuthentication(client, email, password) {
    try {
        return await Account.checkAuthentication(client, email, password);
    }
    catch (err) {
        console.error(err);
        console.log("-------------------------------");
    }
}   
 
async function returnAccount(client, accountId) {
    if (accountId) {
        return await Account.queryAccount(client, accountId);
    }
    else {
        return null;
    }
}

async function changeAccount(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await returnAccount(client, req.body.accountId);
        await account.changeAccountInfo(client, req.body.firstName, req.body.lastName, req.body.phoneNumber);
        if (req.body.accountId !== req.body.email) {
            await account.changeEmail(client, req.body.email);
        }
        await DatabaseClient.endConnection(client);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function changePassword(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await returnAccount(client, req.body.accountId);
        
        if (!account.checkPassword(req.body.oldPassword)) {
            await DatabaseClient.endConnection(client);
            res.sendStatus(401);
            return;
        }
        
        await account.changePassword(client, req.body.newPassword);
        await DatabaseClient.endConnection(client);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function uploadProfilePicture(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await returnAccount(client, req.body.accountId);
        const filename = `/profilePictures/${account.email}.jpg`;
        const buffer = Buffer.from(req.body.profilePicture.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        await fs.writeFile(`./public${filename}`, buffer);

        await account.changeProfilePicture(client, new Photo(filename, `Profile picture`));
        await DatabaseClient.endConnection(client);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function saveAdmins(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();

        for (let account of req.body) {
            const accountObject = await returnAccount(client, account.email);
            
            await accountObject.changeAdminState(client);

            if (accountObject.isAdministrator) {
                const renderer = hbs.create();
                const hotel = await HotelController.returnHotel(client);

                await EmailController.sendEmail({
                    to: accountObject.email,
                    from: 'Aegean Blue Hotel <aegean-blue-hotel@outlook.com>',
                    subject: `You are now an administrator!`,
                    html: await renderer.render(
                        "views/emails/accountMadeAdmin.hbs",
                        {
                            title: "You are now an administrator!",
                            hotel: hotel,
                            preheaderText: `Hello, ${accountObject.firstName}! You are now an administrator of the Aegean Blue Hotel!`,
                            headerText: `You are now an administrator!`,
                            firstName: accountObject.firstName
                        }
                    )
                });
            }
        }

        await DatabaseClient.endConnection(client);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function getAccount(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await returnAccount(client, req.params.accountId)
        await DatabaseClient.endConnection(client);
        res.send(JSON.stringify(account));
    }
    catch (err) {
        next(err);
    }
}

async function getAccounts(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const accounts = await Account.queryAccounts(client);
        await DatabaseClient.endConnection(client);
        res.send(JSON.stringify(accounts));
    }
    catch (err) {
        next(err);
    }
}

async function createAccount(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const accountLevels = await AccountLevelController.returnAccountLevels(client);

        const account = new Account(
            req.body.firstName,
            req.body.lastName,
            req.body.email,
            null,
            await bcrypt.hash(req.body.password, 10),
            false,
            null,
            accountLevels[0]
        );
        await account.createAccount(client);
        await DatabaseClient.endConnection(client);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

export { returnAccount, changeAccount, changePassword, uploadProfilePicture, saveAdmins, getAccount, getAccounts, createAccount, checkAuthentication }