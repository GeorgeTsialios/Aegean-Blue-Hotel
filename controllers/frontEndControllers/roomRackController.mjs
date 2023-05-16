import { ApiControllers } from "../index.mjs";

function navigateToRoomRack(req, res, next) {
    try {
        const account = ApiControllers.AccountController.returnAccount();
        const hotel = ApiControllers.HotelController.returnHotel();
        const rooms = ApiControllers.RoomController.returnRooms();
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
                hotel: hotel
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToRoomRack }