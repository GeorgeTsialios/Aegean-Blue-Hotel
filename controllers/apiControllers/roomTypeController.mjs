import { RoomType } from "../../model/roomType.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

async function returnRoomTypes(client) {
    return await RoomType.queryRoomTypes(client);
}

async function returnAvailableRoomTypes(client,checkInDate,checkOutDate) {
    return await RoomType.queryAvailableRoomTypes(client,checkInDate,checkOutDate);
}

async function getRoomTypes(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        await DatabaseClient.endConnection(client);
        res.send(JSON.stringify(await returnRoomTypes(client)));
    }
    catch (err) {
        next(err);
    }
}

export { getRoomTypes, returnRoomTypes, returnAvailableRoomTypes }