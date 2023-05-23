import express from "express";
import { FrontEndControllers } from '../controllers/index.mjs';

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

export { router } 