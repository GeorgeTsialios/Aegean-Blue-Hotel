import express from "express";
import { ApiControllers, FrontEndControllers } from '../controllers/index.mjs';
import * as DatabaseClient from '../model/databaseClient.mjs';

const router = express.Router();

router.get("/", FrontEndControllers.HomeController.navigateToHome);
router.get("/bookingConfirmation/:bookingId", FrontEndControllers.BookingConfirmationController.navigateToBookingConfirmation);
router.get("/login", FrontEndControllers.LoginController.navigateToLogin);
router.get("/profile", FrontEndControllers.ProfileController.navigateToProfile);
router.get("/roomRack", FrontEndControllers.RoomRackController.navigateToRoomRack);
router.get("/searchResults", FrontEndControllers.SearchResultsController.navigateToSearchResults);
router.get("/bookingForm", FrontEndControllers.BookingFormController.navigateToBookingForm);
router.get("/toBank", FrontEndControllers.ToBankController.navigateToBank);
router.get("/fromBank", FrontEndControllers.FromBankController.navigateFromBank);
router.post("/doLogin", FrontEndControllers.LoginController.doLogin);
router.post("/doRegister", FrontEndControllers.LoginController.doRegister);
router.post("/doRestorePassword", FrontEndControllers.LoginController.doRestorePassword);
router.get("/restorePassword/:email/:password", FrontEndControllers.LoginController.navigateToRestorePassword);
router.get("/doLogout", FrontEndControllers.LoginController.doLogout);
router.get("/email", FrontEndControllers.EmailController.previewEmail);

async function error404(req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);
        res.render(
            'notFound',
            {
                title: "Page not found",
                hotel: hotel,
                account: account,
                roomTypes: roomTypes
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

export { router, error404 } 