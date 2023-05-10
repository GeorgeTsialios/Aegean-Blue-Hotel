function navigateToBookingConfirmation(req, res, next) {
    try {
        res.render(
            "bookingConfirmation",
            {
                title: "Booking Confirmation"
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToBookingConfirmation }