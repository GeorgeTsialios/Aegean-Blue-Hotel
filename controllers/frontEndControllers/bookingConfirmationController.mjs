import { ApiControllers } from "../index.mjs";

async function navigateToBookingConfirmation(req, res, next) {
    try {
        const account = await ApiControllers.AccountController.returnAccount("christoskatsandris@outlook.com");
        const hotel = await ApiControllers.HotelController.returnHotel();
        const booking = await ApiControllers.BookingController.returnBooking(req.params.bookingId);
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
                    account: account
                }
            );
        }
    }
    catch (err) {
        next(err);
    }
}

export { navigateToBookingConfirmation }