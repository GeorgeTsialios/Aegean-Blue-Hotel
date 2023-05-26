import { ApiControllers } from "../index.mjs";
import { Account } from "../../model/account.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";
import { EmailController } from "./emailController.mjs";
import hbs from 'express-handlebars';

async function navigateToLogin(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);
        res.render(
            "login",
            {
                title: "Login",
                linkTags: `
                    <link rel="stylesheet" href="/css/login.css">
                `,
                scriptTags: `
                    <script src = "/js/login.js"></script>
                `,
                account: account,
                hotel: hotel,
                roomTypes: roomTypes,
                accountNotFound: req.query.accountNotFound,
                emailInUse: req.query.emailInUse,
                restoreAccount: req.query.restoreAccount,
                referer: req.query.referer? req.query.referer.replaceAll("_","&"): req.headers.referer,
                login: true
            } 
        ); 
    }
    catch (err) {
        next(err);
    }
}

async function doLogin(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const accountExists = await ApiControllers.AccountController.checkAuthentication(client, req.body.user_email, req.body.user_password);
        await DatabaseClient.endConnection(client);
        const referer = req.body.referer.split("/").slice(3).join("/").replaceAll("/","%2F");

        if (accountExists) {
            Promise.resolve()
                   .then(() => {req.session.accountId = req.body.user_email})
                   .then(() => {res.redirect(`/${referer}`)});
        }
        else {
            res.redirect(`/login?accountNotFound=true&referer=${req.body.referer.replaceAll("&","_")}`);
        }
    }
    catch (err) {
        next(err);
    }
}

async function doLogout(req, res, next) {
    try {
        req.session.destroy();
        res.redirect("/");
    }
    catch (err) {
        next(err);
    }
}

async function doRegister(req, res, next) {
    try {
        const renderer = hbs.create();
        const client = await DatabaseClient.createConnection();
        const hotel = await ApiControllers.HotelController.returnHotel(client);

        if (await Account.queryAccount(client, req.body.user_email)){
            res.redirect(`/login?emailInUse=true&referer=${req.body.referer.replaceAll("&","_")}`);
            await DatabaseClient.endConnection(client);
        }
        else {
            await Account.createAccount(client, req.body.user_fname, req.body.user_lname, req.body.user_email, req.body.user_password);

            await EmailController.sendEmail({
                to: req.body.user_email,
                from: 'Aegean Blue Hotel <aegean-blue-hotel@outlook.com>',
                subject: `Welcome to ${hotel.name}`,
                html: await renderer.render(
                    "views/emails/accountCreated.hbs",
                    {
                        layout: "emailLayout",
                        title: "Account Created",
                        hotel: hotel,
                        preheaderText: `Hello, ${req.body.user_fname}! Welcome to Aegean Blue Hotel! We're very excited to have you on board.`,
                        headerText: `Your account is ready!`,
                        firstName: req.body.user_fname
                    }
                )
            });
            await DatabaseClient.endConnection(client);
        
            const referer = req.body.referer.split("/").slice(3).join("/").replaceAll("/","%2F");
            req.session.accountId = req.body.user_email;
            res.redirect(`/${referer}`);
        }
    }
    catch (err) {
        next(err);
    }
}

async function doRestorePassword(req, res, next) {
    try {
        const renderer = hbs.create();
        const client = await DatabaseClient.createConnection();
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const account = await Account.queryAccount(client, req.body.user_email)
        await DatabaseClient.endConnection(client);

        if (!account) {
            res.redirect(`/login?accountNotFound=true&referer=${req.body.referer.replaceAll("&","_")}`);
        }
        else {
            res.redirect(`/login?restoreAccount=true&referer=${req.body.referer.replaceAll("&","_")}`);
            await EmailController.sendEmail({
                to: account.email,
                from: 'Aegean Blue Hotel <aegean-blue-hotel@outlook.com>',
                subject: `Restore your password`,
                html: await renderer.render(
                    "views/emails/accountRestoreRequested.hbs",
                    {
                        layout: "emailLayout",
                        title: "Restore your password",
                        hotel: hotel,
                        preheaderText: `Hello, ${account.firstName}! Here are the steps to restore your password.`,
                        headerText: `Restore your password`,
                        account: account,
                        restorationURI: `${encodeURIComponent(account.email)}/${encodeURIComponent(account.password)}`
                    }
                )
            });
        }
    }
    catch (err) {
        next(err);
    }
}

async function navigateToRestorePassword(req, res, next) {
    try {
        const renderer = hbs.create();
        const client = await DatabaseClient.createConnection();
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const accountFound = await Account.queryAccountCredentials(client, decodeURIComponent(req.params.email), decodeURIComponent(req.params.password));

        if (accountFound) {
            const account = await Account.queryAccount(client, req.params.email);
            req.session.accountId = account.email;
            res.render(
                "restoreAccountComplete",
                {
                    title: "Account restored",
                    hotel: hotel,
                    account: account
                }
            );

            const newPassword = generatePassword();
            await account.changePassword(client, newPassword);
            await EmailController.sendEmail({
                to: account.email,
                from: 'Aegean Blue Hotel <aegean-blue-hotel@outlook.com>',
                subject: `Your account is restored`,
                html: await renderer.render(
                    "views/emails/accountRestored.hbs",
                    {
                        layout: "emailLayout",
                        title: "Your account is restored",
                        hotel: hotel,
                        preheaderText: `Hello, ${account.firstName}! You have successfully restored your account.`,
                        headerText: `Your account is restored`,
                        firstName: account.firstName,
                        newPassword: newPassword,
                        buttonText: `Go to your profile`,
                        buttonHref: `https://aegean-blue-hotel.fly.dev/profile`
                    }
                )
            });    
        }
        else {
            res.render(
                "restoreAccountComplete",
                {
                    title: "Account restored",
                    hotel: hotel,
                    error: true
                }
            );
        }

        await DatabaseClient.endConnection(client);
    }
    catch (err) {
        next(err);
    }
}

function generatePassword() {
    const length = getRandomInt(10, 16);
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_-+=';
    
    let password = '';
    
    // Ensure at least one character from each type
    password += getRandomCharacter(lowercase);
    password += getRandomCharacter(uppercase);
    password += getRandomCharacter(numbers);
    password += getRandomCharacter(specialChars);
    
    // Fill the remaining characters randomly
    while (password.length < length) {
        const characterSet = lowercase + uppercase + numbers + specialChars;
        password += getRandomCharacter(characterSet);
    }
    
    // Shuffle the password
    password = shuffleString(password);
    
    return password;
}
  
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
function getRandomCharacter(characterSet) {
    const randomIndex = getRandomInt(0, characterSet.length - 1);
    return characterSet[randomIndex];
}
  
function shuffleString(string) {
    const array = string.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

export { navigateToLogin, doLogin, doLogout, doRegister, doRestorePassword, navigateToRestorePassword }