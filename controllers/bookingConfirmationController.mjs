import { Photo } from "../model/photo.mjs";
import { Booking } from "../model/booking.mjs";
import { RoomRequest } from "../model/roomRequest.mjs";
import { RoomType } from "../model/roomType.mjs";

const roomTypes = [
    new RoomType("EXEDD", "Executive Double Room", 2, 150, "RoomAmenities", [
        new Photo("assets/HotelPhotos/double.jpg", "Executive Double Room"),
        new Photo("assets/HotelPhotos/double2.jpg", "Executive Double Room")
    ]),
    new RoomType("DELTW", "Deluxe Twin Room", 2, 180, "RoomAmenities", [
        new Photo("assets/HotelPhotos/double2.jpg", "Deluxe Twin Room"),
        new Photo("assets/HotelPhotos/double.jpg", "Deluxe Twin Room")
    ])
];

const booking = new Booking(
    null,
    "NX7kEPpXqm",
    new Date("2023-04-04"),
    new Date("2023-04-07"),
    2,
    0,
    0,
    237,
    true,
    true,
    true,
    false,
    new Date("2023-02-15"),
    "Konstantinos",
    "Papanikolaou",
    "k.papanikolaou@gmail.com",
    "+306944342414",
    false,
    "Greece",
    "Patras",
    "262 21",
    "Korinthou",
    "82"
)

const roomRequests = [
    new RoomRequest("NX7kEPpXqm", roomTypes[0], 2),
    new RoomRequest("NX7kEPpXqm", roomTypes[1], 1)
]

function navigateToBookingConfirmation(req, res, next) {
    try {
        res.render(
            "bookingConfirmation",
            {
                title: "Booking Confirmation",
                hotelPhoto: new Photo("assets/HotelPhotos/entrance.jpg", "Photo showing the hotel entrance and stairs"),
                googleMapsEmbedLink: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3183.249238738969!2d25.13229240935178!3d37.07537032043668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDA0JzMxLjMiTiAyNcKwMDgnMDAuNiJF!5e0!3m2!1sel!2sgr!4v1680646389320!5m2!1sel!2sgr",
                booking: booking,
                roomRequests: roomRequests
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToBookingConfirmation }