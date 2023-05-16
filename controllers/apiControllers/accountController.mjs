import { Account } from "../../model/account.mjs";
import { AccountLevel } from "../../model/accountLevel.mjs";
import { Photo } from "../../model/photo.mjs";

import fs from "fs/promises";

const accountLevels = [
    new AccountLevel("Loyalty level 0", 0, 0),
    new AccountLevel("Loyalty level 1", 0.1, 3),
    new AccountLevel("Loyalty level 2", 0.2, 6),
    new AccountLevel("Loyalty level 3", 0.3, 10)
];

const accounts = [
    new Account(
        "Christos",
        "Katsandris",
        "christoskatsandris@outlook.com",
        "+306937708141",
        "123456Aa!",
        true,
        null,
        accountLevels[2]
    ),
    new Account(
        "George",
        "Tsialios",
        "georgets2001@yahoo.gr",
        "+306942649054",
        "123456Aa!",
        true,
        null,
        accountLevels[3]
    )
];

function returnAccount(accountId) {
    if (accountId) {
        return accounts.find(account => account.email === accountId);
    }
    else {
        return accounts[0];
    }
}

function changeAccount(req, res, next) {
    try {
        const account = returnAccount(req.body.accountId);
        account.changeAccountInfo(req.body.firstName, req.body.lastName, req.body.phoneNumber);
        if (req.body.accountId !== req.body.email) {
            account.changeEmail(req.body.email);
        }
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

function changePassword(req, res, next) {
    try {
        const account = returnAccount(req.body.accountId);
        
        if (account.password !== req.body.oldPassword) {
            res.sendStatus(401);
            return;
        }
        
        account.changePassword(req.body.newPassword);
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

async function uploadProfilePicture(req, res, next) {
    try {
        const account = returnAccount(req.body.accountId);
        const filename = `/profilePictures/${account.email}.jpg`;
        const buffer = Buffer.from(req.body.profilePicture.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        await fs.writeFile(`./public${filename}`, buffer);

        account.changeProfilePicture(new Photo(filename, `${account.email} profile picture`));
        res.sendStatus(200);
    }
    catch (err) {
        next(err);
    }
}

function getAccount(req, res, next) {
    try {
        res.send(JSON.stringify(returnAccount(req.params.accountId)));
    }
    catch (err) {
        next(err);
    }
}

export { returnAccount, changeAccount, changePassword, uploadProfilePicture, getAccount }