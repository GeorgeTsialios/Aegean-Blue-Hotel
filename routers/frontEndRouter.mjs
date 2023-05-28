import express from "express";
import { ApiControllers, FrontEndControllers } from '../controllers/index.mjs';
import * as DatabaseClient from '../model/databaseClient.mjs';

const router = express.Router();

router.get("/", FrontEndControllers.HomeController.navigateToHome);
router.get("/bookingConfirmation/:bookingId", FrontEndControllers.BookingConfirmationController.navigateToBookingConfirmation);
router.get("/manageBooking/:bookingId", FrontEndControllers.ManageBookingController.navigateToManageBooking);
router.get("/login", FrontEndControllers.LoginController.navigateToLogin);
router.get("/profile", checkAuthentication, FrontEndControllers.ProfileController.navigateToProfile);
router.get("/roomRack", checkAuthentication, checkForAdmin, FrontEndControllers.RoomRackController.navigateToRoomRack);
router.get("/searchResults", FrontEndControllers.SearchResultsController.navigateToSearchResults);
router.get("/bookingForm", FrontEndControllers.BookingFormController.navigateToBookingForm);
router.get("/bookingForm", FrontEndControllers.BookingFormController.navigateToBookingForm);
router.post("/toBank", FrontEndControllers.ToBankController.navigateToBank);
router.post("/fromBank", FrontEndControllers.FromBankController.navigateFromBank);
router.post("/doLogin", FrontEndControllers.LoginController.doLogin);
router.post("/doRegister", FrontEndControllers.LoginController.doRegister);
router.post("/doRestorePassword", FrontEndControllers.LoginController.doRestorePassword);
router.get("/restorePassword/:email/:password", FrontEndControllers.LoginController.navigateToRestorePassword);
router.get("/doLogout", FrontEndControllers.LoginController.doLogout);

async function error404(req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);
        res.render(
            'error',
            {
                title: "Page not found",  
                hotel: hotel,
                account: account, 
                roomTypes: roomTypes,
                notFound: true
            }
        );
    }
    else if (req.accepts('json')) {
        res.send({ error: 'Not found' });
    }
    else {
        res.type('txt').send('Not found');
    }
} 

function checkAuthentication (req, res, next) {
    if (!req.session.accountId)
        res.redirect(`/login?needsAuthentication=true&referer=//${req.originalUrl.replaceAll("&","_")}`);
    else
        next();
}

async function checkForAdmin (req, res, next) {

    const client = await DatabaseClient.createConnection();
    const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
    const hotel = await ApiControllers.HotelController.returnHotel(client);
    const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
    await DatabaseClient.endConnection(client);
    
    if (!account.isAdministrator) {
        res.status(403);
        res.render(
            'error',
            {
                title: "Page not found",
                hotel: hotel,
                account: account,
                roomTypes: roomTypes,
                notAllowed: true
            }
        );
    }
    else
        next();
}

export { router, error404 } 