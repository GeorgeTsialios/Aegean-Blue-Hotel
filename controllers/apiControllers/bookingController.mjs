import { Booking } from '../../model/booking.mjs';
import * as DatabaseClient from "../../model/databaseClient.mjs";
import { RoomTypeController } from './index.mjs';

async function returnBooking(client, id) {
    return await Booking.queryBooking(client, id);
}

async function filterBookings(client, query) {
    const constraints = {};

    if ("madeByAccount" in query) {
        constraints["made_by_account"] = query.madeByAccount;
    }
    if ("isCancelled" in query) {
        constraints["is_cancelled"] = query.isCancelled;
    }
    if ("checkInDateBefore" in query) {
        constraints["check_in_date~before"] = new Date(new Date(query.checkInDateBefore));
    }
    if ("checkOutDateAfter" in query) {
        constraints["check_out_date~after"] = new Date(new Date(query.checkOutDateAfter));
    }

    return await Booking.queryBookings(client, constraints);
}

async function getBooking(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const result = await returnBooking(client, req.params.id);
        if (!result) {
            await DatabaseClient.endConnection(client);
            res.sendStatus(404);
            return;
        }
        await DatabaseClient.endConnection(client);
        res.send(JSON.stringify(result));
    }
    catch (err) {
        next(err);
    }
}

async function getBookings(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const bookings = await filterBookings(client, req.query);
        await DatabaseClient.endConnection(client);
        res.send(JSON.stringify(bookings));
    }
    catch (err) {
        next(err);
    }
}

async function cancelBooking(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const booking = await returnBooking(client, req.params.id);
        if (!booking) {
            await DatabaseClient.endConnection(client);
            res.sendStatus(404);
            return;
        }

        if (!booking.isCancelled) {
            await booking.cancel(client);
            await DatabaseClient.endConnection(client);
            res.sendStatus(200);
        }
        else {
            await DatabaseClient.endConnection(client);
            res.sendStatus(400);
        }
    }
    catch (err) {
        next(err);
    }
}

async function changeBookingDates(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const booking = await returnBooking(client, req.params.id);
        if (!booking) {
            await DatabaseClient.endConnection(client);
            res.sendStatus(404);
            return;
        }

        if (!booking.isCancelled && booking.dateChangeAllowed) {
            const availableRoomTypes = await RoomTypeController.returnAvailableRoomTypes(client, new Date(req.params.checkInDate), new Date(req.params.checkOutDate));

            let available = true;

            for (let roomTypeRequest of booking.roomRequests) {
                if (parseInt(availableRoomTypes.find(roomType => roomType.code === roomTypeRequest.roomType.code).count) < roomTypeRequest.quantity) {
                    available = false;
                    break;
                }
            }

            if (!available) {
                res.sendStatus(403);
            }
            else {
                await booking.changeDates(client, new Date(req.params.checkInDate), new Date(req.params.checkOutDate));
                await DatabaseClient.endConnection(client);
                res.sendStatus(200);
            }
        }
        else {
            await DatabaseClient.endConnection(client);
            res.sendStatus(400);
        }
    }
    catch (err) {
        next(err);
    }
}

async function changeBookingRoomOccupations(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const booking = await returnBooking(client, req.params.id);
        if (!booking) {
            await DatabaseClient.endConnection(client);
            res.sendStatus(404);
            return;
        }

        await booking.changeRoomOccupations(client, req.params.oldRoom, req.params.newRoom);

        await DatabaseClient.endConnection(client);
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(400);
    }
}

export { returnBooking, filterBookings, getBooking, getBookings, cancelBooking, changeBookingDates, changeBookingRoomOccupations }