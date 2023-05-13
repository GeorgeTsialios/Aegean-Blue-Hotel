Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.subtractDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

class Entry {
    constructor(booking, room, index) {
        this.booking = booking;
        this.room = room;
        this.index = index;
    }
}

const rooms = [];
const bookings = [];
let entries = [];

let dateCells;
let currentMonthPlaceholder;
let visibleStartOfWeek;
let visibleEndOfWeek;
let today;
let roomRackRows = {};
let roomOverlaps = {};

document.addEventListener("DOMContentLoaded", async () => {
    dateCells = document.querySelectorAll(".dayHeader");
    currentMonthPlaceholder = document.querySelector("#calendarCurrentMonth");

    await fetchRooms();
    await fetchBookings();
    calendarGoToToday();

    document.querySelector("#calendarButtonToday").addEventListener("click", calendarGoToToday);
    document.querySelector("#calendarButtonPrev").addEventListener("click", calendarGoToPrevWeek);
    document.querySelector("#calendarButtonNext").addEventListener("click", calendarGoToNextWeek);

    document.querySelectorAll("tbody tr").forEach(elem => {
        elem.addEventListener("dragover", dragover_handler);
        elem.addEventListener("drop", drop_handler);
    });
});

function addBooking(date) {
    
}

function calendarGoToToday() {
    today = new Date();
    visibleStartOfWeek = new Date(getStartOfWeek(today).setHours(0,0,0,0));
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    updateDateCells();
    updateVisibleEntries();
}

function calendarGoToPrevWeek() {
    visibleStartOfWeek = visibleStartOfWeek.subtractDays(7);
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    updateDateCells();
    updateVisibleEntries();
}

function calendarGoToNextWeek() {
    visibleStartOfWeek = visibleStartOfWeek.addDays(7);
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    updateDateCells();
    updateVisibleEntries();
}

function getStartOfWeek(date) {
    const output = new Date(date);
    const day = output.getDay() || 7;
    if (day !== 1) {
        output.setHours(-24 * (day - 1));
    }
    return output;
}

async function fetchRooms() {
    const response = await fetch("/api/rooms");
    const data = await response.json();

    for (let room of data) {
        rooms.push(room);
    }
}

async function fetchBookings(startDate, endDate) {
    const response = await fetch("/api/bookings");
    const data = await response.json();

    for (let booking of data) {
        bookings.push(booking);
    }
}

function updateDateCells() {
    for (let i=0; i<7; i++) {
        const currentDate = visibleStartOfWeek.addDays(i);
        dateCells[i].children[1].textContent = currentDate.getDate().toString().padStart(2, "0");
        dateCells[i].children[1].classList = 
            (currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) ?
            "bg-primary rounded-5 d-inline-block px-1 text-light" : "";
    }

    const startMonth = visibleStartOfWeek.toLocaleString("default", {"month": "long", "year": "numeric"});
    const endMonth = visibleEndOfWeek.toLocaleString("default", {"month": "long", "year": "numeric"});

    currentMonthPlaceholder.textContent = (startMonth === endMonth) ? startMonth : `${startMonth} - ${endMonth}`;
}

function updateVisibleEntries() {
    document.querySelectorAll("td").forEach(elem => elem.innerHTML = "");
    roomRackRows = {};
    entries = [];
    for (let booking of bookings) {
        const checkInDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);
        if (checkInDate <= visibleEndOfWeek && checkOutDate >= visibleStartOfWeek) {
            for (let room of booking.roomOccupations) {
                const entry = new Entry(booking, room, booking.roomOccupations.indexOf(room))
                entries.push(entry);
                const node = document.createElement("div");
                node.id = `entry-${booking.id}-${room.number}-${booking.roomOccupations.indexOf(room)}`;
                node.className = "entry";
                node.setAttribute("data-bs-toggle", "modal");
                node.setAttribute("data-bs-target", "#bookingModal");
                node.setAttribute("draggable", "true");
                node.addEventListener("click", () => populateBookingConfirmation(booking));
                node.addEventListener("dragstart", dragstart_handler);
                node.textContent = `${booking.guestInformation.lastName.toUpperCase()}, ${booking.guestInformation.firstName.toUpperCase()}`;
                
                if (checkInDate < visibleStartOfWeek) {
                    node.classList.add("extendsLeft");
                }
                if (checkOutDate > visibleEndOfWeek) {
                    node.classList.add("extendsRight");
                }

                if (checkInDate >= visibleStartOfWeek && checkOutDate <= visibleEndOfWeek) {
                    node.style.width = `${Math.ceil(Math.abs(checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) * 100}%`;
                }
                else if (checkInDate < visibleStartOfWeek && checkOutDate <= visibleEndOfWeek) {
                    node.style.width = `${Math.ceil(Math.abs(checkOutDate - visibleStartOfWeek) / (1000 * 60 * 60 * 24)) * 100 + 50}%`;
                }
                else if (checkInDate >= visibleStartOfWeek && checkOutDate > visibleEndOfWeek) {
                    node.style.width = `${Math.ceil(Math.abs(visibleEndOfWeek - checkInDate) / (1000 * 60 * 60 * 24)) * 100 + 50}%`;
                }
                else {
                    node.style.width = "700%";
                }

                if (checkInDate <= visibleStartOfWeek) {
                    document.querySelector(`#room-${room.number}`).children[2].appendChild(node);
                }
                else {
                    document.querySelector(`#room-${room.number}`).children[Math.ceil(Math.abs(checkInDate - visibleStartOfWeek) / (1000 * 60 * 60 * 24)) + 2].appendChild(node);
                }

                if (roomRackRows[room.number]) {
                    if (!roomRackRows[room.number].includes(entry)) {
                        roomRackRows[room.number].push(entry);
                    }
                }
                else {
                    roomRackRows[room.number] = [entry];
                }
            }
        }
    }

    arrangeOverlappingEntries();
}

function arrangeOverlappingEntries() {
    for (let room of Object.keys(roomRackRows)) {
        const arrangementRows = [[]];

        for (let entry of roomRackRows[room]) {
            (entryHasOverlaps(entry)) ? document.querySelector(`#entry-${entry.booking.id}-${entry.room.number}-${entry.index}`).classList.add("overlapping") : document.querySelector(`#entry-${entry.booking.id}-${entry.room.number}-${entry.index}`).classList.remove("overlapping");
            let i = 0;
            while (i < arrangementRows.length) {
                if (arrangementRows[i].every(elem => !checkIfTwoEntriesOverlap(elem, entry))) {
                    arrangementRows[i].push(entry);
                    break;
                }
                i++;
            }
            if (i >= arrangementRows.length) {
                arrangementRows.push([entry]);
            }
        }

        for (let i=0; i<arrangementRows.length; i++) {
            for (let entry of arrangementRows[i]) {
                document.querySelector(`#entry-${entry.booking.id}-${entry.room.number}-${entry.index}`).style.top = `${i * 25}px`;
            }
        }

        document.querySelector(`#room-${room}`).style.height = `${arrangementRows.length * 25}px`;
    }
}

function entryHasOverlaps(entry) {
    for (let elem of entries) {
        if (checkIfTwoEntriesOverlap(entry, elem)) return true;
    }
    return false;
}

function checkIfTwoEntriesOverlap(e1, e2) {
    if (e1 !== e2 && e1.room.number === e2.room.number && (new Date(e1.booking.checkInDate)) < (new Date(e2.booking.checkOutDate)) && (new Date(e1.booking.checkOutDate)) > (new Date(e2.booking.checkInDate))) {
        return true;
    }
    else {
        return false;
    }
}

function dragstart_handler(event) {
    event.dataTransfer.setData("entryID", event.currentTarget.id);
    event.dataTransfer.setData("columnIndex", Array.from(event.currentTarget.parentElement.parentElement.children).indexOf(event.currentTarget.parentElement));
}

function dragover_handler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function drop_handler(event) {
    event.preventDefault();
    const eventData = event.dataTransfer.getData("entryID").split("-");
    let entry;

    for (let i=0; i<entries.length; i++) {
        if (entries[i].booking.id === eventData[1] && entries[i].room.number === parseInt(eventData[2]) && entries[i].index === parseInt(eventData[3])) {
            entries[i].room = rooms.find(room => room.number === parseInt(event.currentTarget.id.split("-")[1]));
            entry = entries[i];
        }
    }
    for (let i=0; i<bookings.length; i++) {
        if (bookings[i].id === entry.booking.id) {
            bookings[i].roomOccupations[entry.index] = entry.room;
        }
    }

    updateVisibleEntries();
}

function populateBookingConfirmation(booking) {
    document.querySelector("#bookingIDField").textContent = booking.id;
    document.querySelector("#bookingCheckInDateField").textContent = booking.strings.checkInDate;
    document.querySelector("#bookingCheckOutDateField").textContent = booking.strings.checkOutDate;
    document.querySelector("#bookingNumberOfGuestsField").textContent = booking.strings.guests;
    document.querySelector("#bookingTotalPriceField").textContent = booking.strings.totalPrice;

    document.querySelector("#roomRequestsContainer").innerHTML = "";
    for (let roomType of booking.roomRequests) {
        const divNode = document.createElement("div");
        divNode.classList.add("row", "align-items-center", "justify-content-center", "mb-3");
        const imgNode = document.createElement("img");
        imgNode.src = roomType.coverPhoto.source;
        imgNode.classList.add("col-6", "col-lg-3");
        imgNode.alt = roomType.coverPhoto.description;
        divNode.appendChild(imgNode);
        const pNode = document.createElement("p");
        pNode.classList.add("col-6", "col-lg-4");
        pNode.textContent = `${roomType.name}`;
        divNode.appendChild(pNode);
        document.querySelector("#roomRequestsContainer").appendChild(divNode);
    }

    document.querySelector("#bookingGuestFirstNameField").textContent = booking.guestInformation.firstName;
    document.querySelector("#bookingGuestLastNameField").textContent = booking.guestInformation.lastName;
    document.querySelector("#bookingGuestEmailField").textContent = booking.guestInformation.email;
    document.querySelector("#bookingGuestPhoneNumberField").textContent = booking.guestInformation.phoneNumber;
    document.querySelector("#bookingGuestTravelsForWorkField").textContent = booking.strings.guestTravelsForWork;
    document.querySelector("#bookingGuestAddressStreetField").textContent = booking.guestInformation.address.street;
    document.querySelector("#bookingGuestAddressStreetNoField").textContent = booking.guestInformation.address.streetNo;
    document.querySelector("#bookingGuestAddressCityField").textContent = booking.guestInformation.address.city;
    document.querySelector("#bookingGuestAddressPostalCodeField").textContent = booking.guestInformation.address.postalCode;
    document.querySelector("#bookingGuestAddressCountryField").textContent = booking.guestInformation.address.country;
    document.querySelector("#bookingBreakfastIncludedField").textContent = booking.strings.breakfastIncluded;
    document.querySelector("#bookingFreeCancellationAllowedField").textContent = booking.strings.freeCancellationAllowed;
}