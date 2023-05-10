class Photo {
    constructor(source, description, isActiveOnCarousel = false) {
        this.source = source;
        this.description = description;
        this.isActiveOnCarousel = isActiveOnCarousel;
    }
}

export { Photo }