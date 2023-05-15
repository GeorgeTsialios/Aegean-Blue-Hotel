import { Photo } from "../../model/photo.mjs";
import { RoomType } from "../../model/roomType.mjs";

const roomTypes = [
    new RoomType("STA", "Standard Single Room", 20, 1, 80, ["In-room air-conditioning","Free Wi-Fi Internet access","Bathrobes and slippers"], [
        new Photo("assets/HotelPhotos/double.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]), 
    new RoomType("EXEDD", "Executive Double Room", 30, 2, 120, ["Safety Box","Flat-screen TV","Daily maid service","Garden view"], [
        new Photo("assets/HotelPhotos/breakfast.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("EXETW", "Executive Twin Room", 30, 2, 150, ["Mini bar","Coffee tray and kettle in all rooms","Room service (up to midnight)"], [
        new Photo("assets/HotelPhotos/flowers.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("DELTW", "Deluxe Twin Room", 40, 4, 180, ["Marble bathrooms","Bathroom with Bathtub","Hair dryer","Direct dial telephone with voice mail service"], [
        new Photo("assets/HotelPhotos/double2.jpg", "Deluxe Twin Room"),
        new Photo("assets/HotelPhotos/double.jpg", "Deluxe Twin Room")
    ])
];

function returnRoomTypes() {
    return roomTypes;
}

function getRoomTypes(req, res, next) {
    try {
        res.send(JSON.stringify(returnRoomTypes()));
    }
    catch (err) {
        next(err);
    }
}

export { getRoomTypes, returnRoomTypes }