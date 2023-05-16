import { ApiControllers } from "../index.mjs";

function navigateToBookingConfirmation(req, res, next) {
    try {
        const account = ApiControllers.AccountController.returnAccount();
        const hotel = ApiControllers.HotelController.returnHotel();
        const booking = ApiControllers.BookingController.returnBooking(req.params.bookingId);
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
    catch (err) {
        next(err);
    }
}

export { navigateToBookingConfirmation }