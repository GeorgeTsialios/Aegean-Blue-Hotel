class Hotel {
    constructor(name, tagline, photos, googleMapsEmbedLink, freeCancellationPriceCoefficient, breakfastPrice) {
        this.name = name;
        this.tagline = tagline;
        this.photos = photos;
        this.googleMapsEmbedLink = googleMapsEmbedLink;
        this.freeCancellationPriceCoefficient = freeCancellationPriceCoefficient;
        this.breakfastPrice = breakfastPrice;
    }
}

export { Hotel }