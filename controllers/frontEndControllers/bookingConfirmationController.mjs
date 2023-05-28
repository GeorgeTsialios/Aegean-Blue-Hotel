import { ApiControllers } from "../index.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

async function navigateToBookingConfirmation(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const booking = await ApiControllers.BookingController.returnBooking(client, req.params.bookingId);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);

        if (!booking) {
            res.send("Not found.");
        }
        else {
            res.render(
                "bookingConfirmation",
                {
                    title: "Booking Confirmation",
                    hotel: hotel,
                    booking: booking,
                    account: account,
                    roomTypes: roomTypes,
                    roomTypesJSON: JSON.stringify(roomTypes.map(roomType => [roomType, 0])),
                }
            );
        }
    }
    catch (err) {
        next(err);
    }
}

export { navigateToBookingConfirmation }