import { Hotel } from "../model/hotel.mjs";
import { Photo } from "../model/photo.mjs";

const hotelPhotos = [
    new Photo("assets/HotelPhotos/entrance.jpg", "Photo showing the hotel entrance and stairs", true),
    new Photo("assets/HotelPhotos/room_door.jpg", "Photo showing a person opening a room door"),
    new Photo("assets/HotelPhotos/double.jpg", "Photo showing an executive double room"),
    new Photo("assets/HotelPhotos/restaurant.jpg", "Photo showing the hotel restaurant"),
    new Photo("assets/HotelPhotos/pool.jpg", "Photo showing the hotel pool")
];
const hotel = new Hotel("Aegean Blue Hotel", "The Aegean's Blue Gem", hotelPhotos, 1.2, 15);

function navigateToHome(req, res, next) {
    try {
        res.render(
            "home",
            {
                title: "Home",
                linkTags: `
                    <link rel="stylesheet" href="css/home.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
                    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
                `,
                scriptTags: `
                    <script src="js/home.js"></script>
                `,
                hotel: hotel
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToHome }