import express from "express";
import { FrontEndControllers } from '../controllers/index.mjs';

const router = express.Router();

router.get("/", FrontEndControllers.HomeController.navigateToHome);
router.get("/bookingConfirmation", FrontEndControllers.BookingConfirmationController.navigateToBookingConfirmation);
router.get("/login", FrontEndControllers.LoginController.navigateToLogin);
router.get("/profile", FrontEndControllers.ProfileController.navigateToProfile);
router.get("/roomRack", FrontEndControllers.RoomRackController.navigateToRoomRack);
router.get("/searchResults", FrontEndControllers.SearchResultsController.navigateToSearchResults);

export { router }