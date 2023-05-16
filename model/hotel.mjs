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
}

export { Hotel }