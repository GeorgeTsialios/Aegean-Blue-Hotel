import { Hotel } from '../../model/hotel.mjs';

async function returnHotel() {
    return await Hotel.queryHotel();
}

export { returnHotel }