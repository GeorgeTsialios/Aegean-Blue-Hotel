import { ApiControllers } from "../index.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

async function navigateToRoomRack(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        const rooms = await ApiControllers.RoomController.returnRooms(client);
        const bookings = await ApiControllers.BookingController.filterBookings(client, { isCancelled: false });
        await DatabaseClient.endConnection(client);
        
        res.render(
            "roomRack",
            {
                title: "Room Rack",
                linkTags: `
                    <link rel="stylesheet" href="/css/room_rack.css">
                `,
                scriptTags: `
                    <script src="/js/room_rack.js"></script>
                `,
                rooms: rooms,
                roomsJSON: JSON.stringify(rooms),
                account: account,
                hotel: hotel,
                roomTypes: roomTypes,
                bookingsJSON: JSON.stringify(bookings)
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToRoomRack }