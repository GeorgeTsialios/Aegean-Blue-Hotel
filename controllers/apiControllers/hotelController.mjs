import { Hotel } from '../../model/hotel.mjs';

async function returnHotel(client) {
    return await Hotel.queryHotel(client);
}

export { returnHotel }