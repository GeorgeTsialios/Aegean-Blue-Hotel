import pkg from "pg";
import dotenv from "dotenv";
import { RoomType } from "./roomType.mjs";
import { Room } from "./room.mjs";

class Booking {
    constructor(id, numberOfAdults, numberOfChildren, numberOfInfants, checkInDate, checkOutDate, breakfastIncluded, freeCancellationAllowed, dateChangeAllowed, totalPrice, isCancelled, dateCreated, madeByAccount, guest) {
        this.id = id;

        this.guests = {
            "adults": numberOfAdults,
            "children": numberOfChildren,
            "infants": numberOfInfants
        }

        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        
        this.breakfastIncluded = breakfastIncluded;
        this.freeCancellationAllowed = freeCancellationAllowed;
        this.dateChangeAllowed = dateChangeAllowed;
        
        this.totalPrice = totalPrice;
        this.isCancelled = isCancelled;
        this.dateCreated = dateCreated;
        
        this.madeByAccount = madeByAccount;

        this.guest = guest;

        this.roomRequests = [];
        this.roomOccupations = [];

        this.prepareStrings();
    }

    prepareStrings() {
        this.strings = {
            "checkInDate": this.dateToString(this.checkInDate),
            "checkOutDate": this.dateToString(this.checkOutDate),
            "guests": this.getFullNumberOfGuests(),
            "totalPrice": this.totalPrice.toLocaleString("default", { style: "currency", currency: "EUR" }),
            "guestTravelsForWork": {
                "source": (this.guest.travelsForWork) ? "/assets/check-lg.svg" : "/assets/x-lg-black.svg",
                "description": (this.guest.travelsForWork) ? "Yes" : "No",
                "height": (this.guest.travelsForWork) ? "22" : "18"
            },
            "breakfastIncluded": {
                "source": (this.breakfastIncluded) ? "/assets/check-lg.svg" : "/assets/x-lg-black.svg",
                "description": (this.breakfastIncluded) ? "Yes" : "No",
                "height": (this.breakfastIncluded) ? "22" : "18"
            },
            "freeCancellationAllowed": {
                "source": (this.freeCancellationAllowed) ? "/assets/check-lg.svg" : "/assets/x-lg-black.svg",
                "description": (this.freeCancellationAllowed) ? "Yes" : "No",
                "height": (this.freeCancellationAllowed) ? "22" : "18"
            }
        };
    }

    getFullNumberOfGuests() {
        return `${this.guests.adults} ${(this.guests.adults === 1) ? "adult" : "adults"} • ${this.guests.children} ${(this.guests.children === 1) ? "child" : "children"} • ${this.guests.infants} ${(this.guests.infants === 1) ? "infant" : "infants"}`;
    }

    dateToString(date) {
        return date.toLocaleDateString("en-US", { "month": "short", "day": "numeric", "year": "numeric" });
    }

    static async queryBooking(bookingId) {
        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const result = await client.query('select * from public.booking b join public.guest g on b.id = g.booking_id join public.billing_address ba on g.billing_address_id = ba.id where b.id = $1;', [bookingId]);
            await client.end();

            if (result.rows.length === 0) return null;

            const booking = new Booking(
                result.rows[0].booking_id,
                parseInt(result.rows[0].number_of_adults),
                parseInt(result.rows[0].number_of_children),
                parseInt(result.rows[0].number_of_infants),
                new Date(result.rows[0].check_in_date),
                new Date(result.rows[0].check_out_date),
                result.rows[0].breakfast_included,
                result.rows[0].free_cancellation_allowed,
                result.rows[0].date_change_allowed,
                parseFloat(result.rows[0].total_price),
                result.rows[0].is_cancelled,
                new Date(result.rows[0].date_created),
                result.rows[0].made_by_account,
                {
                    "firstName": result.rows[0].first_name,
                    "lastName": result.rows[0].last_name,
                    "email": result.rows[0].email,
                    "phoneNumber": result.rows[0].phone_number,
                    "travelsForWork": result.rows[0].travels_for_work,
                    "address": {
                        "country": result.rows[0].country,
                        "city": result.rows[0].city,
                        "postalCode": result.rows[0].postal_code,
                        "street": result.rows[0].street,
                        "streetNo": result.rows[0].street_no,
                    }
                }
            );

            booking.queryRoomRequests();
            booking.queryRoomOccupations();

            return booking;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
            return null;
        }
    }

    static async queryBookings(constraints) {
        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query("select * from public.booking b join public.guest g on b.id = g.booking_id join public.billing_address ba on g.billing_address_id = ba.id where " + Object.keys(constraints).map(key => `${key} = $${Object.keys(constraints).indexOf(key) + 1}`).join(" and ") + ";", Object.values(constraints));
            await client.end();

            const bookings = [];

            for (let row of res.rows) {
                const booking = new Booking(
                    row.booking_id,
                    parseInt(row.number_of_adults),
                    parseInt(row.number_of_children),
                    parseInt(row.number_of_infants),
                    new Date(row.check_in_date),
                    new Date(row.check_out_date),
                    row.breakfast_included,
                    row.free_cancellation_allowed,
                    row.date_change_allowed,
                    parseFloat(row.total_price),
                    row.is_cancelled,
                    new Date(row.date_created),
                    row.made_by_account,
                    {
                        "firstName": row.first_name,
                        "lastName": row.last_name,
                        "email": row.email,
                        "phoneNumber": row.phone_number,
                        "travelsForWork": row.travels_for_work,
                        "address": {
                            "country": row.country,
                            "city": row.city,
                            "postalCode": row.postal_code,
                            "street": row.street,
                            "streetNo": row.street_no,
                        }
                    }
                );

                await booking.queryRoomRequests();
                await booking.queryRoomOccupations();

                bookings.push(booking);
            }

            return bookings;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async queryRoomRequests() {
        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query("select * from public.room_type_request where booking_id = $1;", [this.id]);
            await client.end();

            this.roomRequests = [];

            const roomTypes = await RoomType.queryRoomTypes();

            for (let row of res.rows) {
                this.roomRequests.push([roomTypes.find(roomType => roomType.code === row.room_type_code), row.quantity]);
            }
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async queryRoomOccupations() {
        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query("select * from public.room_occupation where booking_id = $1;", [this.id]);
            await client.end();

            this.roomOccupations = [];

            const rooms = await Room.queryRooms();

            for (let row of res.rows) {
                this.roomOccupations.push(rooms.find(room => room.number === row.room_number));
            }
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async cancel() {
        this.isCancelled = true;

        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query("update public.booking set is_cancelled = true where id = $1;", [this.id]);
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeDates(checkInDate, checkOutDate) {
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.strings.checkInDate = this.dateToString(this.checkInDate);
        this.strings.checkOutDate = this.dateToString(this.checkOutDate);
        this.dateChangeAllowed = false;

        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query("update public.booking set check_in_date = $1, check_out_date = $2, date_change_allowed = false where id = $3;", [this.checkInDate, this.checkOutDate, this.id]);
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { Booking }