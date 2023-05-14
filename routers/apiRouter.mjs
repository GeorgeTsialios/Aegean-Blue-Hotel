import express from "express";
import { ApiControllers } from "../controllers/index.mjs";

const router = express.Router();

router.get("/bookings", ApiControllers.BookingController.getBookings);
router.get("/cancelBooking/:id", ApiControllers.BookingController.cancelBooking);
router.get("/changeBookingDates/:id/:checkInDate/:checkOutDate", ApiControllers.BookingController.changeBookingDates);
router.get("/rooms", ApiControllers.RoomController.getRooms);

export { router }