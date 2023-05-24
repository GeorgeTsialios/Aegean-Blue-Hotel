import { Room } from "../../model/room.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

async function returnRooms(client) {
    return await Room.queryRooms(client);
}

async function getRooms(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const rooms = await returnRooms(client);
        await DatabaseClient.endConnection(client);
        res.send(JSON.stringify(rooms));
    }
    catch (err) {
        next(err);
    }
}

export { getRooms, returnRooms }