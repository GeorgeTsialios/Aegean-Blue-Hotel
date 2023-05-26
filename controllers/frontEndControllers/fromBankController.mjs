import { Booking } from "../../model/booking.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";


async function navigateFromBank(req, res, next) {
    try {

        // console.log(req.body.bookingInfo);
        const bookingInfo =  JSON.parse(req.body.bookingInfo.replaceAll("&quot;", "\""));
        bookingInfo.checkInDate = new Date(bookingInfo.checkInDate);
        bookingInfo.checkOutDate = new Date(bookingInfo.checkOutDate);
        console.log(bookingInfo);
        const client = await DatabaseClient.createConnection();
        const newBookingID = await Booking.createBooking(client, bookingInfo); 
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
        
    }
    catch (err) {
        next(err);
    }
}

export { navigateFromBank } 
