import { Photo } from "../../model/photo.mjs";
import { RoomType } from "../../model/roomType.mjs";
import { Room } from "../../model/room.mjs";

const roomTypes = [
    new RoomType("STA", "Standard Single Room", 20, 1, 80, ["In-room air-conditioning","Free Wi-Fi Internet access","Bathrobes and slippers"], [
        new Photo("/assets/HotelPhotos/double.jpg", "Executive Double Room"),
        new Photo("/assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]), 
    new RoomType("EXEDD", "Executive Double Room", 30, 2, 120, ["Safety Box","Flat-screen TV","Daily maid service","Garden view"], [
        new Photo("/assets/HotelPhotos/breakfast.jpg", "Executive Double Room"),
        new Photo("/assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("EXETW", "Executive Twin Room", 30, 2, 150, ["Mini bar","Coffee tray and kettle in all rooms","Room service (up to midnight)"], [
        new Photo("/assets/HotelPhotos/flowers.jpg", "Executive Double Room"),
        new Photo("/assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("DELTW", "Deluxe Twin Room", 40, 4, 180, ["Marble bathrooms","Bathroom with Bathtub","Hair dryer","Direct dial telephone with voice mail service"], [
        new Photo("/assets/HotelPhotos/double2.jpg", "Deluxe Twin Room"),
        new Photo("/assets/HotelPhotos/double.jpg", "Deluxe Twin Room")
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

function returnRooms() {
    return rooms;
}

function getRooms(req, res, next) {
    try {
        res.send(JSON.stringify(rooms));
    }
    catch (err) {
        next(err);
    }
}

export { getRooms, returnRooms }