import { Photo } from "../model/photo.mjs";
import { RoomType } from "../model/roomType.mjs";
import { Room } from "../model/room.mjs";

const roomTypes = [
    new RoomType("STA", "Standard Single Room", 2, 150, "RoomAmenities", [
        new Photo("assets/HotelPhotos/double.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("EXEDD", "Executive Double Room", 2, 150, "RoomAmenities", [
        new Photo("assets/HotelPhotos/double.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("EXETW", "Executive Twin Room", 2, 150, "RoomAmenities", [
        new Photo("assets/HotelPhotos/double.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("DELTW", "Deluxe Twin Room", 2, 180, "RoomAmenities", [
        new Photo("assets/HotelPhotos/double2.jpg", "Deluxe Twin Room"),
        new Photo("assets/HotelPhotos/double.jpg", "Deluxe Twin Room")
    ])
];

const rooms = [
    new Room(101, roomTypes[2]),
    new Room(102, roomTypes[1]),
    new Room(103, roomTypes[0]),
    new Room(104, roomTypes[1]),
    new Room(105, roomTypes[3]),
    new Room(106, roomTypes[3]),
    new Room(107, roomTypes[1]),
    new Room(108, roomTypes[0]),
    new Room(109, roomTypes[1]),
    new Room(110, roomTypes[2]),
];

function navigateToRoomRack(req, res, next) {
    try {
        res.render(
            "roomRack",
            {
                title: "Room Rack",
                linkTags: `
                    <link rel="stylesheet" href="css/room_rack.css">
                `,
                scriptTags: `
                    <script src="js/room_rack.js"></script>
                `,
                rooms: rooms
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToRoomRack }