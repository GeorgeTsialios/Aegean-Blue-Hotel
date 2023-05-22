import pkg from 'pg';
import dotenv from 'dotenv';
import { Photo } from './photo.mjs';

class RoomType {
    constructor(code, name, size, capacity, price, amenities, photos) {
        this.code = code;
        this.name = name;
        this.size = size;
        this.capacity = capacity;
        this.capacityArray = Array.apply(1, Array(capacity));
        this.capacityBiggerThanThree = capacity > 3;
        this.price = price;
        this.amenities = amenities;
        this.photos = photos;
        this.coverPhoto = this.photos[0];
    }
    
    static async queryRoomTypes() {
        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query('select * from public.room_type;');
            
            const roomTypes = [];
            
            for (let row of res.rows) {
                const res1 = await client.query('select * from public.room_type_amenity rta join amenity a on rta.amenity_id = a.id where rta.room_type_code = $1;', [row.code]);
                const amenities = [];
                for (let row1 of res1.rows) {
                    amenities.push(row1.description);
                }

                const res2 = await client.query('select * from public.room_type_photo rtp join photo p on rtp.photo_source = p.source where rtp.room_type_code = $1;', [row.code]);
                const photos = [];
                for (let row2 of res2.rows) {
                    photos.push(new Photo(row2.source, row2.description));
                }

                roomTypes.push(new RoomType(row.code, row.name, parseInt(row.size), parseInt(row.capacity), parseFloat(row.price), amenities, photos));
            }
                
            await client.end();
            return roomTypes;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { RoomType }