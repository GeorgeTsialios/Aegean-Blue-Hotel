import { ApiControllers } from "../index.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

async function navigateToBank(req, res, next) {
    try {
        
        const checkInDate = new Date(req.body.checkInDate);
        const checkOutDate = new Date(req.body.checkOutDate);
        const adultsCount = Number(req.body.adultsCount);
        const childrenCount = Number(req.body.childrenCount);
        const infantsCount = Number(req.body.infantsCount);

        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);
        const roomTypesForBooking = [];
        roomTypes.forEach(roomType => {
            let roomTypeCodeCount = `${roomType.code}Count`;
            let roomTypeCount = Number(req.body[roomTypeCodeCount]);
            if (roomTypeCount)
                roomTypesForBooking.push({
                    code: roomType.code,
                    name: roomType.name, 
                    count: roomTypeCount,
                });
        });

        const breakfastIncluded = req.body.breakfastIncluded;
        const freeCancellationIncluded = req.body.freeCancellationIncluded;
        const totalPrice = Number(req.body.totalPrice);

        const firstName = req.body.user_fname;
        const lastName = req.body.user_lname;
        const email = req.body.user_email;
        const phoneNumber = req.body.user_phone;
        const travelsForWork = req.body.TravelForWork? true : false;

        const country = req.body.user_country;
        const city = req.body.user_city;
        const postalCode = req.body.user_postal_code;
        const street = req.body.user_street_name;
        const streetNo = req.body.user_street_number;

        res.render(
            "spinner",
            {
                layout: "spinnerLayout",
                title: "Redirecting to Bank...",
                message: "Please wait while we redirect you to the bank environment...",
                linkTags:`<link rel="stylesheet" href="/css/spinner.css">`,
                scriptTags: `<script src="/js/spinner1.js"></script>`,

                account: account,
                accountJSON: account ? JSON.stringify(account) : null,
                hotel: hotel,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                adultsCount: adultsCount,
                childrenCount: childrenCount,
                infantsCount: infantsCount,
                roomTypesForBookingJSON: JSON.stringify(roomTypesForBooking),
                breakfastIncluded: breakfastIncluded,
                freeCancellationIncluded: freeCancellationIncluded,
                totalPrice: totalPrice,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                travelsForWork: travelsForWork,
                country: country,
                city: city,
                postalCode: postalCode,
                street: street,
                streetNo: streetNo,
                toBank: true
            }
        );

    }
    catch (err) {
        next(err);
    }
}
 
export { navigateToBank } 
