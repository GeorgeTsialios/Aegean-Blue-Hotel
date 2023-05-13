import { Account } from "../../model/account.mjs";
import { AccountLevel } from "../../model/accountLevel.mjs";

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

const upcomingBookings = [
    new Booking(account, "NX7kEPpXqm", new Date("2023-04-04"), new Date("2023-04-07"), 2, 0, 0, 237, true, true, true, false, new Date("2023-02-15"), {
        "firstName": "Christos",
        "lastName": "Katsandris",
        "email": "christoskatsandris@outlook.com",
        "phoneNumber": "+306937708141",
        "travelsForWork": false,
        "address": {
            "country": "Greece",
            "city": "Patras",
            "postalCode": "262 21",
            "street": "Korinthou",
            "streetNo": "82"
        }
    }, null, null),
    new Booking(account, "aIK658fa60", new Date("2023-07-13"), new Date("2023-07-18"), 2, 2, 0, 512, true, true, true, false, new Date("2023-04-15"), {
        "firstName": "Christos",
        "lastName": "Katsandris",
        "email": "christoskatsandris@outlook.com",
        "phoneNumber": "+306937708141",
        "travelsForWork": false,
        "address": {
            "country": "Greece",
            "city": "Patras",
            "postalCode": "262 21",
            "street": "Korinthou",
            "streetNo": "82"
        }
    }, null, null)];

const pastBookings = [
    new Booking(account, "eq8f78qefA", new Date("2022-12-24"), new Date("2022-12-26"), 2, 0, 0, 374, true, false, true, false, new Date("2022-11-30"), {
        "firstName": "Christos",
        "lastName": "Katsandris",
        "email": "christoskatsandris@outlook.com",
        "phoneNumber": "+306937708141",
        "travelsForWork": false,
        "address": {
            "country": "Greece",
            "city": "Patras",
            "postalCode": "262 21",
            "street": "Korinthou",
            "streetNo": "82"
        }
    }, null, null),
    new Booking(account, "T7t0xv505e", new Date("2021-08-11"), new Date("2021-08-18"), 2, 2, 0, 694, false, true, true, false, new Date("2021-05-03"), {
        "firstName": "Christos",
        "lastName": "Katsandris",
        "email": "christoskatsandris@outlook.com",
        "phoneNumber": "+306937708141",
        "travelsForWork": false,
        "address": {
            "country": "Greece",
            "city": "Patras",
            "postalCode": "262 21",
            "street": "Korinthou",
            "streetNo": "82"
        }
    }, null, null),
    new Booking(account, "xz987E7x9E", new Date("2019-06-05"), new Date("2019-06-08"), 1, 1, 0, 341, false, false, true, false, new Date("2019-05-18"), {
        "firstName": "Christos",
        "lastName": "Katsandris",
        "email": "christoskatsandris@outlook.com",
        "phoneNumber": "+306937708141",
        "travelsForWork": false,
        "address": {
            "country": "Greece",
            "city": "Patras",
            "postalCode": "262 21",
            "street": "Korinthou",
            "streetNo": "82"
        }
    }, null, null)
];

function navigateToProfile(req, res, next) {
    try {
        res.render(
            "profile",
            {
                title: "Account &amp; Bookings",
                linkTags: `
                    <link rel="stylesheet" href="css/profile.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
                    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
                `,
                scriptTags: `
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
                    <script src="js/profile.js"></script>
                `,
                account: account,
                upcomingBookings: upcomingBookings,
                pastBookings: pastBookings,
                account: account
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToProfile }