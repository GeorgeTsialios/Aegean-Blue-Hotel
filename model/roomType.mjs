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
    
    static async queryRoomTypes(client) {
        try {
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
                
            return roomTypes;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    static async queryAvailableRoomTypes(client, checkInDate, checkOutDate) {
        try {
            const availableRoomTypes = [];
            const result = await client.query(
                                            `select	room_type, (count_all - count_unavailable) as count_available 
                                             from (select room_type,count(*) as count_all 
                                                   from room r 
                                                   group by room_type 
                                                   order by room_type) as table1 natural join   (select code as room_type,count("number") as count_unavailable 
                                                                                                 from room_type rt left join	( select room_type,r."number" 
                                                                                                                               from room r 
                                                                                                                                 where   r."number" in (select room_number 
                                                                                                                                                         from room_occupation ro
                                                                                                                                                      where ro.booking_id in (select id
                                                                                                                                                                                 from booking 
                                                                                                                                                                                 where is_cancelled=false and $1 < check_out_date and $2 > check_in_date))) as tem on rt.code = tem.room_type 						   	     
                                                                                                 group by code 
                                                                                                 order by code) as table2`,
                                            [checkInDate, checkOutDate]);
            for (let row of result.rows) {
                availableRoomTypes.push({code: row.room_type, count: row.count_available});
            }
            console.log(availableRoomTypes);
            return availableRoomTypes;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

}

export { RoomType }