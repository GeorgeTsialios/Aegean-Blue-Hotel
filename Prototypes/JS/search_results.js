const guests = {
    "adultsCount": 1,
    "childrenCount": 0,
    "infantsCount": 0
}

const originalGuests = {}

const dates = {
    "check-in": new Date(2023,4,31),
    "check-out": new Date (2023,5,2)
}

const originalDates = {}

class RoomType {
    constructor(code,name,capacity,price,amenities,photos){
        this.code = code;
        this.name = name;
        this.capacity = capacity;
        this.price = price;
        this.amenities = amenities;
        this.photos = photos;
    }
}

const roomTypes = [[new RoomType("EXEDD","Executive Double Room",2,150,"EXEDDAmenities","EXEDDPhotos"), 0],[new RoomType("DLX","Deluxe Room",3,180,"DLXAmenities","DLXPhotos"), 0]];

let TotalPrice = 0;
const freeCancellationCoefficient = 1.2;
const breakfastPriceperNightperPerson = 15;

class AccountLevel {
    constructor(name, discount, maxCompletedBookings) {
        this.name = name;
        this.discount = discount;
        this.maxCompletedBookings = maxCompletedBookings;
    }
}

const accountLevels = [
    new AccountLevel("Loyalty level 0", 0, 0),
    new AccountLevel("Loyalty level 1", 0.1, 3),
    new AccountLevel("Loyalty level 2", 0.2, 6),
    new AccountLevel("Loyalty level 3", 0.3, 10)
  ];

  const userAccountLevel = accountLevels[1];

document.addEventListener("DOMContentLoaded", () => {
    setOriginalDates();
    setOriginalGuests();
    document.querySelector("#adultsCountMinus").addEventListener("click", () => updateGuests("adultsCount", "Minus"));
    document.querySelector("#adultsCountPlus").addEventListener("click", () => updateGuests("adultsCount", "Plus"));
    document.querySelector("#childrenCountMinus").addEventListener("click", () => updateGuests("childrenCount", "Minus"));
    document.querySelector("#childrenCountPlus").addEventListener("click", () => updateGuests("childrenCount", "Plus"));
    document.querySelector("#infantsCountMinus").addEventListener("click", () => updateGuests("infantsCount", "Minus"));
    document.querySelector("#infantsCountPlus").addEventListener("click", () => updateGuests("infantsCount", "Plus"));

    document.querySelector("#BreakfastIncluded").addEventListener("change",() => updateTotal());
    document.querySelector("#FreeCancellation").addEventListener("change",() => updateTotal());

    roomTypes.forEach((room) => {
        document.querySelector(`#${room[0].code}CountPlus`).addEventListener("click", () => {updateRooms(room, "Plus");  updateTotal();} );
        document.querySelector(`#${room[0].code}CountMinus`).addEventListener("click", () => {updateRooms(room, "Minus"); updateTotal();} );
    });

    const countButtons = document.querySelectorAll(".countButton");
    countButtons.forEach((Button) => Button.addEventListener('click',() => checkFormChange()));

    document.querySelector("#BookButtonWrapper").setAttribute("data-bs-title",`You need space for ${originalGuests["numberOfGuests"]} more ${(originalGuests["numberOfGuests"] === 1)?"person":"people"}.`);
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
})

function setOriginalDates() {
    const originalDateString = document.querySelector("#daterange").textContent;
    const originalDateArray = originalDateString.split('–');
    originalDateArray.forEach((date,i,array) => array[i] = array[i].trim());
    originalDates["check-in"] = new Date(Date.parse(originalDateArray[0])); 
    originalDates["check-out"] = new Date(Date.parse(originalDateArray[1])); 
    originalDates["numberOfNights"] = (originalDates["check-out"] - originalDates["check-in"]) / (1000 * 3600 * 24);
}

function setOriginalGuests() {
    const originalGuestsString = document.querySelector("#guests").textContent;
    const originalGuestsArray = originalGuestsString.split('•');
    originalGuestsArray.forEach((guests,i,array) => {
        array[i] = array[i].trim();
        array[i] = Number(array[i][0]);
    });
    originalGuests["adultsCount"] = originalGuestsArray[0];
    originalGuests["childrenCount"] = originalGuestsArray[1];
    originalGuests["infantsCount"] = originalGuestsArray[2];
    originalGuests["numberOfGuests"] = originalGuests["adultsCount"] + originalGuests["childrenCount"];
}

function updateRooms(room, symbol) {
    const lowerLimit = 0;
    (symbol === "Minus") ? room[1]-- : room[1]++;
    
    document.querySelector(`#${room[0].code}CountMinus`).disabled = (room[1] <= lowerLimit);
    document.querySelector(`#${room[0].code}CountPlus`).disabled = (room[1] >= 9);
    
    document.querySelector(`#${room[0].code}Count`).textContent = room[1];
}

function updateTotal() {
    let TotalPrice = 0;
    let TotalPriceWithDiscount = 0;
    let Discount = 0;
    let totalCapacity = 0;
    let freeCancellationSelected = document.querySelector("#FreeCancellation").checked;
    let breakfastSelected = document.querySelector("#BreakfastIncluded").checked;

    roomTypes.forEach((room) => TotalPrice += (originalDates["numberOfNights"] * room[1] * room[0].price * (freeCancellationSelected?freeCancellationCoefficient:1)));
    if (TotalPrice !== 0) {
        TotalPrice += breakfastSelected?(originalGuests["numberOfGuests"] * originalDates["numberOfNights"] * breakfastPriceperNightperPerson):0;
        Discount = TotalPrice * (userAccountLevel.discount);
        TotalPriceWithDiscount = TotalPrice - Discount;
        document.querySelector("#totalPrice").innerHTML = `Total Price: <span style="text-decoration: line-through 1.5px; color: #CC0000; font-size: smaller; font-weight: lighter">${TotalPrice}&euro;</span> ${TotalPriceWithDiscount}&euro;`;
        document.querySelector("#offcanvasButton>span").innerHTML = `${TotalPriceWithDiscount}&euro;`;
        document.querySelector("#price_policies").innerHTML = `<li class="fw-semibold">You are saving ${Discount}&euro; with your ${userAccountLevel.name} account.</li><li>All taxes are included in this price.</li><li>Every customer is entitled to one free change of dates for their booking.</li>`;
    }
    else {
        document.querySelector("#totalPrice").innerHTML = `Total Price: ${TotalPrice}&euro;`;
        document.querySelector("#offcanvasButton>span").innerHTML = `${TotalPrice}&euro;`;
        document.querySelector("#price_policies").innerHTML = `<li>All taxes are included in this price.</li><li>Every customer is entitled to one free change of dates for their booking.</li>`;
    }
    for (let room of roomTypes)
        totalCapacity += room[0].capacity * room[1];
    document.querySelector("#BookButton").disabled = (totalCapacity < originalGuests["numberOfGuests"]);

    const tooltip = bootstrap.Tooltip.getInstance('#BookButtonWrapper');
    if (originalGuests["numberOfGuests"] - totalCapacity <= 0) {
        // document.querySelector("#BookButtonWrapper").removeAttribute("data-bs-title");
        // document.querySelector("#BookButtonWrapper").removeAttribute("data-bs-toggle");
        // document.querySelector("#BookButtonWrapper").removeAttribute("data-bs-title");
        tooltip.disable();
    }
    else {
        // document.querySelector("#BookButtonWrapper").setAttribute("data-bs-toggle","tooltip");
        tooltip.enable();
        document.querySelector("#BookButtonWrapper").setAttribute("data-bs-title",`You need space for ${originalGuests["numberOfGuests"] - totalCapacity} more ${(originalGuests["numberOfGuests"] - totalCapacity === 1)?"person":"people"}.`);
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }
}

function updateGuests(elem, symbol) {
    const lowerLimit = (elem === "adultsCount") ? 1 : 0;
    (symbol === "Minus") ? guests[elem]-- : guests[elem]++;

    document.querySelector(`#${elem}Minus`).disabled = (guests[elem] <= lowerLimit);
    document.querySelector(`#${elem}Plus`).disabled = (guests[elem] >= 9);

    document.querySelector(`#${elem}`).textContent = guests[elem];
    document.querySelector("#guests").innerHTML = `${guests['adultsCount']} ${(guests['adultsCount'] === 1) ? "adult" : "adults"} &bull; ${guests['childrenCount']} ${(guests['childrenCount'] === 1) ? "child" : "children"} &bull; ${guests['infantsCount']} ${(guests['infantsCount'] === 1) ? "infant" : "infants"}`;
}

function checkFormChange() {
    if (
        Math.floor((dates['check-in'] - originalDates['check-in']) / (1000 * 3600 * 24)) !== 0 || 
        Math.floor((dates['check-out'] - originalDates['check-out']) / (1000 * 3600 * 24)) !== 0 || 
        guests["adultsCount"] !== originalGuests["adultsCount"] || 
        guests["childrenCount"] !== originalGuests["childrenCount"] || 
        guests["infantsCount"] !== originalGuests["infantsCount"]
        ) 
        document.querySelector("#search").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
            </svg> Apply Changes`;
    else
        document.querySelector("#search").innerHTML = "Search";
}

$(() => {
    $('#daterange').daterangepicker(
        {
            startDate: originalDates["check-in"],
            endDate: originalDates["check-out"],
            drops: 'down',
            minDate: new Date(),
            autoApply: true
        },
        (start, end) => {
            dates['check-in'] = start.toDate();
            dates['check-out'] = end.toDate();
            document.querySelector("#daterange").innerHTML = `${dates['check-in'].toLocaleDateString("default", {"month": "short", "day": "numeric", "year": "numeric"})} &#8211 ${dates['check-out'].toLocaleDateString("default", {"month": "short", "day": "numeric", "year": "numeric"})}`
            checkFormChange();
        }
    );
});