import { Booking } from "../../model/booking.mjs";
import { Hotel } from "../../model/hotel.mjs";
import { EmailController } from "./emailController.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";
import hbs from 'express-handlebars';


async function navigateFromBank(req, res, next) {
    try {

        const bookingInfo =  JSON.parse(req.body.bookingInfo.replaceAll("&quot;", "\""));
        bookingInfo.checkInDate = new Date(bookingInfo.checkInDate);
        bookingInfo.checkOutDate = new Date(bookingInfo.checkOutDate);
        console.log(bookingInfo);
        const client = await DatabaseClient.createConnection();
        const newBookingID = await Booking.createBooking(client, bookingInfo);
        const hotel = await Hotel.queryHotel(client);
        const booking = await Booking.queryBooking(client, newBookingID);
        await DatabaseClient.endConnection(client);
  

        res.render(
            "spinner",
            {
                layout: "spinnerLayout",
                title: "Redirecting to Hotel Website...",
                message: "Payment successful! Returning to hotel website...",
                linkTags:`<link rel="stylesheet" href="/css/spinner.css">`,
                scriptTags: `<script src="/js/spinner2.js"></script>`,
                newBookingID: newBookingID,
                fromBank: true
            }
        );

        const renderer = hbs.create();
        const emailMessage = {
            to: booking.guest.email,
            from: 'Aegean Blue Hotel <aegean-blue-hotel@outlook.com>',
            subject: `Your booking is complete!`,
            html: await renderer.render(
                "views/emails/bookingCreated.hbs",
                {
                    title: "Your booking is complete!",
                    hotel: hotel,
                    preheaderText: `Hello, ${booking.guest.firstName}! You have successfully made your booking.`,
                    headerText: `Your booking is complete!`,
                    booking: booking,
                    checkRequired: true
                }
            )
        }

        await EmailController.sendEmail(emailMessage);

        if (booking.madeByAccount !== booking.guest.email) {
            emailMessage.to = booking.madeByAccount;
            await EmailController.sendEmail(emailMessage);
        }

        emailMessage.to = "christoskatsandris@outlook.com";
        await EmailController.sendEmail(emailMessage);

        emailMessage.to = "georgetsialios@gmail.com";
        await EmailController.sendEmail(emailMessage);
    }
    catch (err) {
        next(err);
    }
}

export { navigateFromBank } 
