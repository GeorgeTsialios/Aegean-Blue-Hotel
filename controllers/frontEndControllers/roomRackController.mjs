import { ApiControllers } from "../index.mjs";

async function navigateToRoomRack(req, res, next) {
    try {
        const account = await ApiControllers.AccountController.returnAccount(req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel();
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes();
        const rooms = await ApiControllers.RoomController.returnRooms();
        const bookings = await ApiControllers.BookingController.filterBookings({ isCancelled: false });
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