import { ApiControllers } from "../index.mjs";

async function navigateToRoomRack(req, res, next) {
    try {
        const account = await ApiControllers.AccountController.returnAccount("christoskatsandris@outlook.com");
        const hotel = await ApiControllers.HotelController.returnHotel();
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes();
        const rooms = await ApiControllers.RoomController.returnRooms();
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
                account: account,
                hotel: hotel,
                roomTypes: roomTypes
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToRoomRack }