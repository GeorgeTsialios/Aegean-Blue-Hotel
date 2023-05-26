import { ApiControllers } from "../index.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

async function navigateToBookingForm(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        await DatabaseClient.endConnection(client);
        const checkInDate = new Date(req.query.checkInDate);
        const checkOutDate = new Date(req.query.checkOutDate);
        const lengthOfStayString = `${(checkOutDate -checkInDate) / (1000 * 3600 * 24)} ${(checkOutDate -checkInDate) / (1000 * 3600 * 24) === 1 ? "night" : "nights"}`;
        const adultsCount = Number(req.query.adultsCount);
        const childrenCount = Number(req.query.childrenCount);
        const infantsCount = Number(req.query.infantsCount);
        const guestsString = `${adultsCount} ${(adultsCount === 1) ? "adult" : "adults"} • ${childrenCount} ${(childrenCount === 1) ? "child" : "children"} • ${infantsCount} ${(infantsCount === 1) ? "infant" : "infants"}`;

        const roomTypesForBooking = [];
        roomTypes.forEach(roomType => {
            let roomTypeCodeCount = `${roomType.code}Count`;
            let roomTypeCount = Number(req.query[roomTypeCodeCount]);
            if (roomTypeCount > 0)
                roomTypesForBooking.push({
                    code: roomType.code,
                    name: roomType.name, 
                    count: roomTypeCount,
                    price: roomType.price
                });
        });

        const breakfastIncluded = req.query.breakfastIncluded === "true";
        const freeCancellationIncluded = req.query.freeCancellationIncluded === "true";

        res.render(
            "bookingForm",
            {
                title: "Booking Form",
                linkTags: `
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/css/intlTelInput.css">
                <link rel="stylesheet" href="/css/booking_form.css">
                <link rel="stylesheet" href="/css/countryselect.css">
                `,
                scriptTags: `
                <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/intlTelInput.min.js"></script>
                <script src = "/js/booking_form.js"></script>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
                <script src="/js/countryselect.min.js"></script>
                <script> $("#country").countrySelect({
                    defaultCountry: "gr",
                    preferredCountries: ["gr"],
                    responsiveDropdown: true
                    }); 
                </script>
                `,
                account: account,
                accountJSON: account ? JSON.stringify(account) : null,
                hotel: hotel,
                roomTypes: roomTypes,
                checkInDate: checkInDate.toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"}),
                checkOutDate: checkOutDate.toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"}),
                lengthOfStayString: lengthOfStayString,
                adultsCount: adultsCount,
                childrenCount: childrenCount,
                infantsCount: infantsCount,
                guestsString: guestsString,
                roomTypesForBooking: roomTypesForBooking,
                roomTypesForBookingJSON: JSON.stringify(roomTypesForBooking),
                breakfastIncluded: breakfastIncluded,
                freeCancellationIncluded: freeCancellationIncluded
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToBookingForm }