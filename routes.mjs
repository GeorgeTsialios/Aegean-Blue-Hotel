import express from "express";
import * as Controllers from './controllers/index.mjs';

const router = express.Router();

router.get("/", Controllers.HomeController.navigateToHome);
router.get("/bookingConfirmation", Controllers.BookingConfirmationController.navigateToBookingConfirmation);
router.get("/login", Controllers.LoginController.navigateToLogin);
router.get("/profile", Controllers.ProfileController.navigateToProfile);
router.get("/roomRack", Controllers.RoomRackController.navigateToRoomRack);
router.get("/searchResults", Controllers.SearchResultsController.navigateToSearchResults);

export { router }