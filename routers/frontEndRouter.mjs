import express from "express";
import { ApiControllers, FrontEndControllers } from '../controllers/index.mjs';

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
router.get("/doLogout", FrontEndControllers.LoginController.doLogout);

async function error404(req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        const account = await ApiControllers.AccountController.returnAccount(req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel();
        res.render(
            'notFound',
            {
                title: "Page not found",
                hotel: hotel,
                account: account
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