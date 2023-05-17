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
}

export { RoomType }