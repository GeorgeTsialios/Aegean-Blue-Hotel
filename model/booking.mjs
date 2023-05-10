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
    }
}

export { Booking }