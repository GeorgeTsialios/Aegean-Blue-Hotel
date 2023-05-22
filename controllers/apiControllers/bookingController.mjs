import { Booking } from '../../model/booking.mjs';

async function returnBooking(id) {
    return await Booking.queryBooking(id);
}

async function filterBookings(query) {
    const constraints = {};

    if ("madeByAccount" in query) {
        constraints["made_by_account"] = query.madeByAccount;
    }
    if ("isCancelled" in query) {
        constraints["is_cancelled"] = query.isCancelled;
    }

    return await Booking.queryBookings(constraints);
}

async function getBooking(req, res, next) {
    try {
        const result = await returnBooking(req.params.id);
        if (!result) {
            res.sendStatus(404);
            return;
        }
        res.send(JSON.stringify(result));
    }
    catch (err) {
        next(err);
    }
}

async function getBookings(req, res, next) {
    try {
        res.send(JSON.stringify(await filterBookings(req.query)));
    }
    catch (err) {
        next(err);
    }
}

async function cancelBooking(req, res, next) {
    try {
        const booking = await returnBooking(req.params.id);
        if (!booking) {
            res.sendStatus(404);
            return;
        }

        if (!booking.isCancelled) {
            booking.cancel();
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (err) {
        next(err);
    }
}

async function changeBookingDates(req, res, next) {
    try {
        const booking = await returnBooking(req.params.id);
        if (!booking) {
            res.sendStatus(404);
            return;
        }

        if (!booking.isCancelled && booking.dateChangeAllowed) {
            booking.changeDates(new Date(req.params.checkInDate), new Date(req.params.checkOutDate));
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    }
    catch (err) {
        next(err);
    }
}

export { returnBooking, filterBookings, getBooking, getBookings, cancelBooking, changeBookingDates }