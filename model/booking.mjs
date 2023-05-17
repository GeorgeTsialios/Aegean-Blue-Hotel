class Booking {
    constructor(id, checkInDate, checkOutDate, dateCreated, guests, totalPrice, breakfastIncluded, freeCancellationAllowed, dateChangeAllowed, isCancelled, madeByAccount, guestInformation, roomRequests, roomOccupations) {
        this.id = id;
        
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.dateCreated = dateCreated;
        
        this.guests = guests;
        
        this.totalPrice = totalPrice;
        this.breakfastIncluded = breakfastIncluded;
        this.freeCancellationAllowed = freeCancellationAllowed;
        this.dateChangeAllowed = dateChangeAllowed;
        this.isCancelled = isCancelled;
        this.madeByAccount = madeByAccount;

        this.guestInformation = guestInformation;

        if (roomRequests) this.roomRequests = roomRequests;
        else this.roomRequests = [];

        if (roomOccupations) this.roomOccupations = roomOccupations;
        else this.roomOccupations = [];

        this.prepareStrings();
    }

    prepareStrings() {
        this.strings = {
            "checkInDate": this.dateToString(this.checkInDate),
            "checkOutDate": this.dateToString(this.checkOutDate),
            "guests": this.getFullNumberOfGuests(),
            "totalPrice": this.totalPrice.toLocaleString("default", { style: "currency", currency: "EUR" }),
            "guestTravelsForWork": (this.guestTravelsForWork) ? "Yes" : "No",
            "breakfastIncluded": (this.breakfastIncluded) ? "Yes" : "No",
            "freeCancellationAllowed": (this.freeCancellationAllowed) ? "Yes" : "No"
        };
    }

    getFullNumberOfGuests() {
        return `${this.guests.adults} ${(this.guests.adults === 1) ? "adult" : "adults"} • ${this.guests.children} ${(this.guests.children === 1) ? "child" : "children"} • ${this.guests.infants} ${(this.guests.infants === 1) ? "infant" : "infants"}`;
    }

    dateToString(date) {
        return date.toLocaleDateString("en-US", { "month": "short", "day": "numeric", "year": "numeric" });
    }

    cancel() {
        this.isCancelled = true;
    }

    changeDates(checkInDate, checkOutDate) {
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.strings.checkInDate = this.dateToString(this.checkInDate);
        this.strings.checkOutDate = this.dateToString(this.checkOutDate);
        this.dateChangeAllowed = false;
    }
}

export { Booking }