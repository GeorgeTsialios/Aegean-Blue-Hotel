import { ApiControllers } from "../index.mjs";

function navigateToProfile(req, res, next) {
    try {
        const account = ApiControllers.AccountController.returnAccount();
        const hotel = ApiControllers.HotelController.returnHotel();
        const bookings = ApiControllers.BookingController.filterBookings({
            "madeByAccount": account.email
        });

        res.render(
            "profile",
            {
                title: "Account &amp; Bookings",
                linkTags: `
                    <link rel="stylesheet" href="/css/profile.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="/js/moment.min.js"></script>
                    <link rel="stylesheet" type="text/css" href="/css/daterangepicker.css" />
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/css/intlTelInput.css">
                `,
                scriptTags: `
                    <script type="text/javascript" src="/js/daterangepicker.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/intlTelInput.min.js"></script>
                    <script src="/js/profile.js"></script>
                `,
                ongoingBookings: bookings.filter(booking => booking.checkInDate <= new Date() && booking.checkOutDate >= new Date()),
                upcomingBookings: bookings.filter(booking => booking.checkInDate > new Date()),
                pastBookings: bookings.filter(booking => booking.checkOutDate < new Date()),
                account: account,
                hotel: hotel
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToProfile }