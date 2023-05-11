class RoomType {
    constructor(code, name, capacity, price, amenities, photos) {
        this.code = code;
        this.name = name;
        this.capacity = capacity;
        this.price = price;
        this.amenities = amenities;
        this.photos = photos;
        this.coverPhoto = this.photos[0];
    }
}

export { RoomType }