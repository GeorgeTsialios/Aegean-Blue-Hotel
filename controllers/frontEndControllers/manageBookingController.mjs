import { ApiControllers } from "../index.mjs";
import { EmailController } from "./emailController.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";
import hbs from 'express-handlebars';

async function navigateToManageBooking(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const booking = await ApiControllers.BookingController.returnBooking(client, req.params.bookingId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);

        if (!booking) {
            res.status(404).render(
                'notFound',
                {
                    title: "Booking not found",
                    hotel: hotel,
                    roomTypes: roomTypes
                }
            )
        }
        else {
            if (booking.madeByAccount) {
                res.redirect("/profile");
            }
            else {
                if (!Object.keys(req.query).includes("otp")) {
                    req.session.otp = Math.floor(100000 + Math.random() * 900000);
                    const renderer = hbs.create();

                    await EmailController.sendEmail({
                        to: booking.guest.email,
                        from: 'Aegean Blue Hotel <aegean-blue-hotel@outlook.com>',
                        subject: `Your one-time passcode - ${req.session.otp}`,
                        html: await renderer.render(
                            "views/emails/otp.hbs",
                            {
                                title: "One-time passcode",
                                hotel: hotel,
                                preheaderText: `Hello, ${booking.guest.firstName}! Here is your one-time passcode: ${req.session.otp}.`,
                                headerText: `Your one-time passcode`,
                                firstName: booking.guest.firstName,
                                otp: req.session.otp
                            }
                        )
                    });
                    renderVerification(res, hotel, roomTypes, false);
                }
                else if (parseInt(req.query.otp) !== req.session.otp) {
                    renderVerification(res, hotel, roomTypes, true);
                }
                else {
                    renderManageBooking(res, hotel, roomTypes, booking);
                }
            }
        }
    }
    catch (err) {
        next(err);
    }
}

function renderVerification(res, hotel, roomTypes, invalidPasscode) {
    res.render(
        "verification",
        {
            title: "Verification",
            linkTags: `
                <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                <script type="text/javascript" src="/js/moment.min.js"></script>
                <link rel="stylesheet" type="text/css" href="/css/daterangepicker.css" />
                <link rel="stylesheet" type="text/css" href="/css/verification.css" />
            `,
            scriptTags: `
                <script src="/js/verification.js"></script>
            `,
            hotel: hotel,
            roomTypes: roomTypes,
            invalidPasscode: invalidPasscode
        }
    );
}

function renderManageBooking(res, hotel, roomTypes, booking) {
    Date.prototype.subtractDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() - days);
        return date;
    }

    res.render(
        "manageBooking",
        {
            title: "Manage booking",
            linkTags: `
                <link rel="stylesheet" type="text/css" href="/css/profile.css" />
                <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                <script type="text/javascript" src="/js/moment.min.js"></script>
                <link rel="stylesheet" type="text/css" href="/css/daterangepicker.css" />
            `,
            scriptTags: `
                <script type="text/javascript" src="/js/daterangepicker.js"></script>
                <script src="/js/manage_booking.js"></script>
            `,
            hotel: hotel,
            roomTypes: roomTypes,
            booking: booking,
            bookingJSON: JSON.stringify(booking),
            changesNotAllowed: booking.isCancelled || new Date() >= booking.checkInDate.subtractDays(3)
        }
    );
}

export { navigateToManageBooking }