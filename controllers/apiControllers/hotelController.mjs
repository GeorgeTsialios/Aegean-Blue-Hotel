import { Photo } from "../../model/photo.mjs";
import { Hotel } from '../../model/hotel.mjs';

const hotelPhotos = [
    new Photo("/assets/HotelPhotos/entrance.jpg", "Photo showing the hotel entrance and stairs", true),
    new Photo("/assets/HotelPhotos/room_door.jpg", "Photo showing a person opening a room door"),
    new Photo("/assets/HotelPhotos/double.jpg", "Photo showing an executive double room"),
    new Photo("/assets/HotelPhotos/restaurant.jpg", "Photo showing the hotel restaurant"),
    new Photo("/assets/HotelPhotos/pool.jpg", "Photo showing the hotel pool")
];

const hotel = new Hotel(
    "Aegean Blue Hotel",
    "The Aegean's Blue Gem",
    new Photo("/assets/aegean-blue-hotel-logo.png", "Aegean Blue Hotel Logo"),
    hotelPhotos,
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3183.249238738969!2d25.13229240935178!3d37.07537032043668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDA0JzMxLjMiTiAyNcKwMDgnMDAuNiJF!5e0!3m2!1sel!2sgr!4v1680646389320!5m2!1sel!2sgr",
    1.2,
    15
);

function returnHotel() {
    return hotel;
}

export { returnHotel }