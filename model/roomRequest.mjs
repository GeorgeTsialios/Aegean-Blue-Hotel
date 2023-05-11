class RoomRequest {
    constructor(bookingId, roomType, howMany) {
        this.bookingId = bookingId;
        this.roomType = roomType;
        this.howMany = howMany;
    }
}

export { RoomRequest }