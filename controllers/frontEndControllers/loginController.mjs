import { ApiControllers } from "../index.mjs";
import { Account } from "../../model/account.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

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

        if (accountExists){
            req.session.accountId = req.body.user_email;
            res.redirect(`/${referer}`);
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
        const client = await DatabaseClient.createConnection();

        if (await Account.queryAccount(client, req.body.user_email)){
            res.redirect(`/login?emailInUse=true&referer=${req.body.referer.replaceAll("&","_")}`);
            await DatabaseClient.endConnection(client);
        }
        else {
            await Account.createAccount(client, req.body.user_fname, req.body.user_lname, req.body.user_email, req.body.user_password);
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

export { navigateToLogin, doLogin, doLogout, doRegister }