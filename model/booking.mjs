class Booking {
    constructor(madeByAccount, id, checkInDate, checkOutDate, numberOfAdults, numberOfChildren, numberOfInfants, totalPrice, breakfastIncluded, freeCancellationAllowed, dateChangeAllowed, isCancelled, dateCreated, guestFirstName, guestLastName, guestEmail, guestPhoneNumber, guestTravelsForWork, guestAddressCountry, guestAddressCity, guestAddressPostalCode, guestAddressStreet, guestAddressStreetNo) {
        this.madeByAccount = madeByAccount;
        this.id = id;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfAdults = numberOfAdults;
        this.numberOfChildren = numberOfChildren;
        this.numberOfInfants = numberOfInfants;
        this.totalPrice = totalPrice;
        this.breakfastIncluded = breakfastIncluded;
        this.freeCancellationAllowed = freeCancellationAllowed;
        this.dateChangeAllowed = dateChangeAllowed;
        this.isCancelled = isCancelled;
        this.dateCreated = dateCreated;
        this.guestFirstName = guestFirstName;
        this.guestLastName = guestLastName;
        this.guestEmail = guestEmail;
        this.guestPhoneNumber = guestPhoneNumber;
        this.guestTravelsForWork = guestTravelsForWork;
        this.guestAddressCountry = guestAddressCountry;
        this.guestAddressCity = guestAddressCity;
        this.guestAddressPostalCode = guestAddressPostalCode;
        this.guestAddressStreet = guestAddressStreet;
        this.guestAddressStreetNo = guestAddressStreetNo;

        this.prepareStrings();
    }

    prepareStrings() {
        this.strings = {
            "checkInDate": this.dateToString(this.checkInDate),
            "checkOutDate": this.dateToString(this.checkOutDate),
            "numberOfGuests": this.getFullNumberOfGuests(),
            "totalPrice": this.totalPrice.toLocaleString("default", { style: "currency", currency: "EUR" }),
            "guestTravelsForWork": (this.guestTravelsForWork) ? "Yes" : "No",
            "breakfastIncluded": (this.breakfastIncluded) ? "Yes" : "No",
            "freeCancellationAllowed": (this.freeCancellationAllowed) ? "Yes" : "No"
        };
    }

    getFullNumberOfGuests() {
        return `${this.numberOfAdults} ${(this.numberOfAdults === 1) ? "adult" : "adults"} • ${this.numberOfChildren} ${(this.numberOfChildren === 1) ? "child" : "children"} • ${this.numberOfInfants} ${(this.numberOfInfants === 1) ? "infant" : "infants"}`;
    }

    dateToString(date) {
        return date.toLocaleDateString("en-US", { "month": "short", "day": "numeric", "year": "numeric" });
    }
}

export { Booking }