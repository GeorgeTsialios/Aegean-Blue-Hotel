import pkg from 'pg';
import dotenv from 'dotenv';
import { RoomType } from './roomType.mjs';

class Room {
    constructor(number, roomType) {
        this.number = number;
        this.roomType = roomType;
    }

    static async queryRooms() {
        try {
            const roomTypes = await RoomType.queryRoomTypes();

            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query('select * from public.room;');
            await client.end();

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