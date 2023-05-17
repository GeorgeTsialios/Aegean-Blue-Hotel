import { Booking } from '../../model/booking.mjs';
import { Photo } from "../../model/photo.mjs";
import { RoomType } from "../../model/roomType.mjs";
import { Room } from "../../model/room.mjs";
import { AccountController } from './index.mjs';

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

const account = AccountController.returnAccount();

const bookings = [
    new Booking(
        "NX7kEPpXqm", new Date(2023, 4, 17), new Date(2023, 4, 29), new Date(2023, 2, 4),
        {
            "adults": 2,
            "children": 1,
            "infants": 0
        }, 240.34, true, true, true, false, account,
        {
            "firstName": "Konstantinos",
            "lastName": "Papanikolaou",
            "email": "k.papanikolaou@gmail.com",
            "phoneNumber": "+306944342414",
            "travelsForWork": false,
            "address": {
                "country": "Greece",
                "city": "Patras",
                "postalCode": "262 21",
                "street": "Korinthou",
                "streetNo": "82"
            }
        }, [roomTypes[2]], [rooms[0]]
    ),
    new Booking(
        "aW7nB3x9cJ", new Date(2023, 3, 29), new Date(2023, 4,  5), new Date(2023, 2, 4),
        {
            "adults": 2,
            "children": 1,
            "infants": 0,
        }, 240.34, true, true, true, false, null, 
        {
            "firstName": "Nikos",
            "lastName": "Papadopoulos",
            "email": "nikos.papadopoulos@gmail.com",
            "phoneNumber": "+30 210 1234567",
            "travelsForWork": true,
            "address": {
                "country": "Greece",
                "city": "Athens",
                "postalCode": "105 62",
                "street": "Stadiou",
                "streetNo": "13"
            }
        }, [roomTypes[1]], [rooms[1]]
    ),
    // new Booking(null, "Dp4sT8qY2m", new Date(2023, 4,  3), new Date(2023, 4,  5), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Eleni",
    //     "lastName": "Anastasiadou",
    //     "email": "eleni.anastasiadou@yahoo.com",
    //     "phoneNumber": "+30 210 2345678",
    //     "travelsForWork": false,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Thessaloniki",
    //         "postalCode": "546 26",
    //         "street": "Themistokleous",
    //         "streetNo": "7"
    //     }
    // }, [roomTypes[0]], [rooms[2]]),
    // new Booking(null, "Gt1mL9yR7b", new Date(2023, 4,  5), new Date(2023, 4, 10), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Stelios",
    //     "lastName": "Karagiannis",
    //     "email": "stelios.karagiannis@hotmail.com",
    //     "phoneNumber": "+30 210 3456789",
    //     "travelsForWork": true,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Piraeus",
    //         "postalCode": "185 36",
    //         "street": "Agiou Konstantinou",
    //         "streetNo": "25"
    //     }
    // }, [roomTypes[0]], [rooms[2]]),
    // new Booking(null, "eF2jS4hP8N", new Date(2023, 4,  1), new Date(2023, 4,  2), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Stavros",
    //     "lastName": "Dimitriou",
    //     "email": "stavros.dimitriou@yahoo.com",
    //     "phoneNumber": "+30 210 8901234",
    //     "travelsForWork": false,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Kalamata",
    //         "postalCode": "241 00",
    //         "street": "Dimokratias Square",
    //         "streetNo": "5"
    //     }
    // }, [roomTypes[1]], [rooms[3]]),
    // new Booking(account, "iK6gM7fZ1L", new Date(2023, 4,  2), new Date(2023, 4,  3), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Katerina",
    //     "lastName": "Triantafyllou",
    //     "email": "katerina.triantafyllou@hotmail.com",
    //     "phoneNumber": "+30 210 9012345",
    //     "travelsForWork": true,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Patra",
    //         "postalCode": "262 23",
    //         "street": "Pireos",
    //         "streetNo": "22"
    //     }
    // }, [roomTypes[1]], [rooms[3]]),
    // new Booking(null, "Hx5pJ9cD6V", new Date(2023, 4,  3), new Date(2023, 4,  7), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Marina",
    //     "lastName": "Andreou",
    //     "email": "marina.andreou@hotmail.com",
    //     "phoneNumber": "+30 210 6789012",
    //     "travelsForWork": false,
    //     "address": {
    //         "country": "Cyprus",
    //         "city": "Nicosia",
    //         "postalCode": "1010",
    //         "street": "Filikis Etaireias Square",
    //         "streetNo": "2"
    //     }
    // }, [roomTypes[3], roomTypes[3]], [rooms[4], rooms[5]]),
    // new Booking(null, "Vw3yX7bU1f", new Date(2023, 3, 27), new Date(2023, 4,  2), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Alexandros",
    //     "lastName": "Kontogiannis",
    //     "email": "alexandros.kontogiannis@gmail.com",
    //     "phoneNumber": "+30 210 0123456",
    //     "travelsForWork": false,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Larissa",
    //         "postalCode": "412 22",
    //         "street": "Eleftheriou Venizelou",
    //         "streetNo": "17"
    //     }
    // }, [roomTypes[1]], [rooms[6]]),
    // new Booking(null, "kS2gH9tE4j", new Date(2023, 3, 20), new Date(2023, 4, 13), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Anna",
    //     "lastName": "Mavrommati",
    //     "email": "anna.mavrommati@gmail.com",
    //     "phoneNumber": "+30 210 4567890",
    //     "travelsForWork": false,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Marousi",
    //         "postalCode": "151 22",
    //         "street": "Kifissias",
    //         "streetNo": "31"
    //     }
    // }, [roomTypes[0]], [rooms[7]]),
    // new Booking(null, "lP6zN1dQ8m", new Date(2023, 4,  4), new Date(2023, 4,  6), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Alexis",
    //     "lastName": "Petridis",
    //     "email": "alexis.petridis@yahoo.com",
    //     "phoneNumber": "+30 210 5678901",
    //     "travelsForWork": true,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Athens",
    //         "postalCode": "106 82",
    //         "street": "Alexandras",
    //         "streetNo": "11"
    //     }
    // }, [roomTypes[1]], [rooms[8]]),
    // new Booking(account, "Bv9jF5cT7a", new Date(2023, 4,  2), new Date(2023, 4,  6), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), {
    //     "firstName": "Athina",
    //     "lastName": "Sakellariou",
    //     "email": "athina.sakellariou@gmail.com",
    //     "phoneNumber": "+30 210 7890123",
    //     "travelsForWork": true,
    //     "address": {
    //         "country": "Greece",
    //         "city": "Thessaloniki",
    //         "postalCode": "546 31",
    //         "street": "Ethnikis Antistaseos",
    //         "streetNo": "16"
    //     }
    // }, [roomTypes[2]], [rooms[9]])
];

function returnBooking(id) {
    return bookings.find(booking => booking.id === id);
}

function filterBookings(query) {
    return bookings.filter(booking => {
        let accepted = true;

        if ("madeByAccount" in query) {
            accepted = accepted && booking.madeByAccount && booking.madeByAccount.email === query.madeByAccount;
        }

        if ("isCancelled" in query) {
            accepted = accepted && booking.isCancelled === (query.isCancelled === "true");
        }
        
        return accepted;
    });
}

function getBookings(req, res, next) {
    try {
        res.send(JSON.stringify(filterBookings(req.query)));
    }
    catch (err) {
        next(err);
    }
}

function cancelBooking(req, res, next) {
    try {
        bookings.find(booking => booking.id === req.params.id).cancel();
        res.send();
    }
    catch (err) {
        next(err);
    }
}

function changeBookingDates(req, res, next) {
    try {
        bookings.find(booking => booking.id === req.params.id).changeDates(new Date(req.params.checkInDate), new Date(req.params.checkOutDate));
        res.send();
    }
    catch (err) {
        next(err);
    }
}

export { returnBooking, filterBookings, getBookings, cancelBooking, changeBookingDates }