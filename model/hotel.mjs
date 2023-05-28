import { Photo } from './photo.mjs';

class Hotel {
    constructor(name, tagline, logo, photos, googleMapsEmbedLink, freeCancellationPriceCoefficient, breakfastPrice) {
        this.name = name;
        this.tagline = tagline;
        this.logo = logo;
        this.photos = photos;
        this.googleMapsEmbedLink = googleMapsEmbedLink;
        this.freeCancellationPriceCoefficient = freeCancellationPriceCoefficient;
        this.breakfastPrice = breakfastPrice;
        this.coverPhoto = this.photos[0];
    }

    static async queryHotel(client) {
        try {
            const res = await client.query('select * from public.hotel;');
            const res1 = await client.query('select * from public.photo where type = \'hotel\';');

            const photos = [];
            for (let row of res1.rows) {
                photos.push(new Photo(row.source, row.description, res1.rows.indexOf(row) === 0));
            }

            return new Hotel(
                res.rows.find(row => row.key === "hotel_name").value,
                res.rows.find(row => row.key === "hotel_tagline").value,
                new Photo(res.rows.find(row => row.key === "hotel_logo").value, "Aegean Blue Hotel Logo"),
                photos,
                res.rows.find(row => row.key === "hotel_google_maps_embed_link").value,
                parseFloat(res.rows.find(row => row.key === "free_cancellation_coefficient").value),
                parseFloat(res.rows.find(row => row.key === "breakfast_price").value)
            )
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { Hotel }