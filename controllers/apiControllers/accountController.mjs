import bcrypt from "bcrypt";
import { Account } from "../../model/account.mjs";
import { AccountLevel } from "../../model/accountLevel.mjs";
import { AccountLevelController } from "./index.mjs";
import { Photo } from "../../model/photo.mjs";

import fs from "fs/promises";

async function returnAccount(accountId) {
    if (accountId) {
        return await Account.queryAccount(accountId);
    }
    else {
        return null;
    }
}

async function changeAccount(req, res, next) {
    try {
        const account = await returnAccount(req.body.accountId);
        await account.changeAccountInfo(req.body.firstName, req.body.lastName, req.body.phoneNumber);
        if (req.body.accountId !== req.body.email) {
            await account.changeEmail(req.body.email);
        }
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function changePassword(req, res, next) {
    try {
        const account = await returnAccount(req.body.accountId);
        
        if (account.password !== req.body.oldPassword) {
            res.sendStatus(401);
            return;
        }
        
        await account.changePassword(req.body.newPassword);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function uploadProfilePicture(req, res, next) {
    try {
        const account = await returnAccount(req.body.accountId);
        const filename = `/profilePictures/${account.email}.jpg`;
        const buffer = Buffer.from(req.body.profilePicture.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        await fs.writeFile(`./public${filename}`, buffer);

        await account.changeProfilePicture(new Photo(filename, `${account.email} profile picture`));
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function getAccount(req, res, next) {
    try {
        res.send(JSON.stringify(await returnAccount(req.params.accountId)));
    }
    catch (err) {
        next(err);
    }
}

async function createAccount(req, res, next) {
    try {
        const accountLevels = await AccountLevelController.returnAccountLevels();

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
        await account.createAccount();
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

export { returnAccount, changeAccount, changePassword, uploadProfilePicture, getAccount, createAccount }