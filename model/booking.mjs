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

    static async createBooking(client, bookingInfo) {
        try {
            const newBookingID = Booking.generateBookingID();
            let result = null;
            await client.query(
                'insert into public.booking values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
                [newBookingID, bookingInfo.adultsCount, bookingInfo.childrenCount, bookingInfo.infantsCount, bookingInfo.checkInDate, bookingInfo.checkOutDate, bookingInfo.breakfastIncluded, bookingInfo.freeCancellationIncluded, true, bookingInfo.totalPrice, false, new Date(), bookingInfo.madeByAccount]
            ); 

            if (bookingInfo.guest.address.city || bookingInfo.guest.address.postalCode || bookingInfo.guest.address.street || bookingInfo.guest.address.streetNo)
                result = await client.query(
                                           'insert into public.billing_address values (DEFAULT,$1, $2, $3, $4, $5) returning id;',
                                            [bookingInfo.guest.address.country, bookingInfo.guest.address.city, bookingInfo.guest.address.postalCode, bookingInfo.guest.address.street, bookingInfo.guest.address.streetNo]
                                            );
            
            await client.query(
                'insert into public.guest values ($1, $2, $3, $4, $5, $6, $7);',
                [newBookingID,bookingInfo.guest.firstName, bookingInfo.guest.lastName, bookingInfo.guest.email, bookingInfo.guest.phoneNumber, bookingInfo.guest.travelsForWork,result? result.rows[0].id:null]
            );

            for (let roomType of bookingInfo.roomTypesForBooking) {
                await client.query(
                    'insert into public.room_type_request values ($1, $2, $3);',
                    [newBookingID, roomType.code, roomType.count]
                );

                for (let i=0; i<roomType.count; i++) {

                    result = await client.query(
                       `select available_rooms."number"
                        from( (select r."number"
                              from room r 
                              where room_type = $1
                              except 
                              select r."number"
                              from room r 
                              where room_type = $1 and r."number" in (select room_number 
                                                                            from room_occupation ro
                                                                         where ro.booking_id in (select id
                                                                                                    from booking 
                                                                                                    where $2 < check_out_date and $3 > check_in_date)))) as available_rooms
                        order by available_rooms."number"
                        limit 1`,
                        [roomType.code, bookingInfo.checkInDate, bookingInfo.checkOutDate]
                    );

                    if (result.rows.length === 0)
                        result = await client.query(
                                       `select r."number"
                                        from room r 
                                        where room_type = $1
                                        order by r."number"
                                        limit 1`,
                                        [roomType.code]
                                );

                    await client.query(
                        'insert into public.room_occupation values ($1, $2);',
                        [newBookingID, result.rows[0].number]
                    );
                }
            } 

            return newBookingID;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
            return null;
        }
    }

    static generateBookingID() {
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let bookingID = '';
        for ( let i = 0; i < 15; i++ ) 
            bookingID += characters.charAt(Math.floor(Math.random() * characters.length));
    
        return bookingID;
    }

    static async queryBooking(client, bookingId) {
        try {
            const result = await client.query('select * from public.booking b join public.guest g on b.id = g.booking_id left join public.billing_address ba on g.billing_address_id = ba.id where b.id = $1;', [bookingId]);

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

            await booking.queryRoomRequests(client);
            await booking.queryRoomOccupations(client);

            return booking;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
            return null;
        }
    }

    static async queryBookings(client, constraints) {
        try {
            const res = await client.query("select * from public.booking b join public.guest g on b.id = g.booking_id left join public.billing_address ba on g.billing_address_id = ba.id where " + Object.keys(constraints).map(key => `${key} = $${Object.keys(constraints).indexOf(key) + 1}`).join(" and ") + ";", Object.values(constraints));

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

                await booking.queryRoomRequests(client);
                await booking.queryRoomOccupations(client);

                bookings.push(booking);
            }

            return bookings;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async queryRoomRequests(client) {
        try {
            const res = await client.query("select * from public.room_type_request where booking_id = $1;", [this.id]);

            this.roomRequests = [];

            const roomTypes = await RoomType.queryRoomTypes(client);

            for (let row of res.rows) {
                this.roomRequests.push({
                    roomType: roomTypes.find(roomType => roomType.code === row.room_type_code), 
                    quantity: row.quantity
                });
            }
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async queryRoomOccupations(client) {
        try {
            const res = await client.query("select * from public.room_occupation where booking_id = $1;", [this.id]);
            const rooms = await Room.queryRooms(client);
            this.roomOccupations = [];

            for (let row of res.rows) {
                this.roomOccupations.push(rooms.find(room => room.number === row.room_number));
            }
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async cancel(client) {
        this.isCancelled = true;

        try {
            await client.query("update public.booking set is_cancelled = true where id = $1;", [this.id]);
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeDates(client, checkInDate, checkOutDate) {
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.strings.checkInDate = this.dateToString(this.checkInDate);
        this.strings.checkOutDate = this.dateToString(this.checkOutDate);
        this.dateChangeAllowed = false;

        try {
            await client.query("update public.booking set check_in_date = $1, check_out_date = $2, date_change_allowed = false where id = $3;", [this.checkInDate, this.checkOutDate, this.id]);

            for (let roomOccupation of this.roomOccupations) {
                await client.query("delete from public.room_occupation where booking_id = $1 and room_number = $2;", [this.id, roomOccupation.number]);
            }

            for (let roomTypeRequest of this.roomRequests) {
                for (let i=0; i<roomTypeRequest.quantity; i++) {
                    let result = await client.query(
                       `select available_rooms."number"
                        from( (select r."number"
                              from room r 
                              where room_type = $1
                              except 
                              select r."number"
                              from room r 
                              where room_type = $1 and r."number" in (select room_number 
                                                                            from room_occupation ro
                                                                         where ro.booking_id in (select id
                                                                                                    from booking 
                                                                                                    where $2 < check_out_date and $3 > check_in_date)))) as available_rooms
                        order by available_rooms."number"
                        limit 1`,
                        [roomTypeRequest.roomType.code, this.checkInDate, this.checkOutDate]
                    );

                    if (result.rows.length === 0)
                        result = await client.query(
                                       `select r."number"
                                        from room r 
                                        where room_type = $1
                                        order by r."number"
                                        limit 1`,
                                        [roomTypeRequest.roomType.code]
                                );

                    await client.query(
                        'insert into public.room_occupation values ($1, $2);',
                        [this.id, result.rows[0].number]
                    );
                }
            }
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { Booking }