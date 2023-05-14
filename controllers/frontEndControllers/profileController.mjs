import { Account } from "../../model/account.mjs";
import { AccountLevel } from "../../model/accountLevel.mjs";
import { ApiControllers } from "../index.mjs";

// import { Photo } from "../../model/photo.mjs";
import { Booking } from "../../model/booking.mjs";

const accountLevels = [
    new AccountLevel("Loyalty level 0", 0, 0),
    new AccountLevel("Loyalty level 1", 0.1, 3),
    new AccountLevel("Loyalty level 2", 0.2, 6),
    new AccountLevel("Loyalty level 3", 0.3, 10)
];

const account = new Account(
    "Christos",
    "Katsandris",
    "christoskatsandris@outlook.com",
    "+306937708141",
    "123456",
    true,
    null,
    // new Photo("assets/HotelPhotos/double2.jpg", "Deluxe Twin Room"),
    accountLevels[3]
);

async function navigateToProfile(req, res, next) {
    try {
        const bookings = ApiControllers.BookingController.filterBookings({
            "madeByAccount": account.email
        });

        res.render(
            "profile",
            {
                title: "Account &amp; Bookings",
                linkTags: `
                    <link rel="stylesheet" href="css/profile.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="js/moment.min.js"></script>
                    <link rel="stylesheet" type="text/css" href="css/daterangepicker.css" />
                `,
                scriptTags: `
                    <script type="text/javascript" src="js/daterangepicker.js"></script>
                    <script src="js/profile.js"></script>
                `,
                account: account,
                ongoingBookings: bookings.filter(booking => booking.checkInDate <= new Date() && booking.checkOutDate >= new Date()),
                upcomingBookings: bookings.filter(booking => booking.checkInDate > new Date()),
                pastBookings: bookings.filter(booking => booking.checkOutDate < new Date()),
                account: account
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToProfile }