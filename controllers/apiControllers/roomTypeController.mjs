import { RoomType } from "../../model/roomType.mjs";

async function returnRoomTypes() {
    return await RoomType.queryRoomTypes();
}

async function getRoomTypes(req, res, next) {
    try {
        res.send(JSON.stringify(await returnRoomTypes()));
    }
    catch (err) {
        next(err);
    }
}

export { getRoomTypes, returnRoomTypes }