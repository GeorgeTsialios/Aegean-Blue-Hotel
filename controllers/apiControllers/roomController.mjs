import { Room } from "../../model/room.mjs";

async function returnRooms() {
    return await Room.queryRooms();
}

async function getRooms(req, res, next) {
    try {
        res.send(JSON.stringify(await returnRooms()));
    }
    catch (err) {
        next(err);
    }
}

export { getRooms, returnRooms }