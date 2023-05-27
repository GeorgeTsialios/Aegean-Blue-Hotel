import express from "express";
import { ApiControllers } from "../controllers/index.mjs";

const router = express.Router();

router.get("/account/:accountId", ApiControllers.AccountController.getAccount);
router.post("/changeAccount", ApiControllers.AccountController.changeAccount);
router.post("/changePassword", ApiControllers.AccountController.changePassword);
router.post("/uploadProfilePicture", ApiControllers.AccountController.uploadProfilePicture);

router.get("/booking/:id", ApiControllers.BookingController.getBooking);
router.get("/bookings", ApiControllers.BookingController.getBookings);
router.get("/cancelBooking/:id", ApiControllers.BookingController.cancelBooking);
router.get("/changeBookingDates/:id/:checkInDate/:checkOutDate", ApiControllers.BookingController.changeBookingDates);
router.get("/changeBookingRoomOccupations/:id/:oldRoom/:newRoom", ApiControllers.BookingController.changeBookingRoomOccupations);

router.get("/rooms", ApiControllers.RoomController.getRooms);
router.get("/roomTypes", ApiControllers.RoomTypeController.getRoomTypes);

export { router }