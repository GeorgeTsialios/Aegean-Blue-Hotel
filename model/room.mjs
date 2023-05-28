import { RoomType } from './roomType.mjs';

class Room {
    constructor(number, roomType) {
        this.number = number;
        this.roomType = roomType;
    }

    static async queryRooms(client) {
        try {
            const res = await client.query('select * from public.room;');
            const roomTypes = await RoomType.queryRoomTypes(client);

            const rooms = [];

            for (let row of res.rows) {
                rooms.push(
                    new Room(parseInt(row.number), roomTypes.find(roomType => roomType.code === row.room_type))
                );
            }

            return rooms;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { Room }