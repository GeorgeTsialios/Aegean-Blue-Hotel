import express from "express";
import { ApiControllers } from "../controllers/index.mjs";

const router = express.Router();

router.get("/bookings", ApiControllers.BookingController.getBookings);
router.get("/rooms", ApiControllers.RoomController.getRooms);

export { router }