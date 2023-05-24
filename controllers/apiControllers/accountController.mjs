import bcrypt from "bcrypt";
import { Account } from "../../model/account.mjs";
import { AccountLevelController } from "./index.mjs";
import { Photo } from "../../model/photo.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

import fs from "fs/promises";

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
        
        if (account.password !== req.body.oldPassword) {
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

        await account.changeProfilePicture(client, new Photo(filename, `${account.email} profile picture`));
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

export { returnAccount, changeAccount, changePassword, uploadProfilePicture, getAccount, createAccount, checkAuthentication }