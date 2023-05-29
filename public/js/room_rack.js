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

let today = new Date();
let visibleStartOfWeek = new Date(getStartOfWeek(today).setHours(12,0,0,0));
let visibleEndOfWeek = visibleStartOfWeek.addDays(6);

let loadingModal;
let bookings;
let allEntries = [];

let dateCells;
let currentMonthPlaceholder;
let roomRackRows = {};
let roomOverlaps = {};
let bookingToCancel = null;

document.addEventListener("DOMContentLoaded", () => {
    dateCells = document.querySelectorAll(".dayHeader");
    currentMonthPlaceholder = document.querySelector("#calendarCurrentMonth");

    calendarGoToToday();

    document.querySelector("#calendarButtonToday").addEventListener("click", calendarGoToToday);
    document.querySelector("#calendarButtonPrev").addEventListener("click", calendarGoToPrevWeek);
    document.querySelector("#calendarButtonNext").addEventListener("click", calendarGoToNextWeek);
    document.querySelector("#cancelBookingButton").addEventListener("click", populateCancelConfirmation);
    document.querySelector("#confirmationModalButton").addEventListener("click", handleCancelConfirmation);

    document.querySelectorAll("tbody tr").forEach(elem => {
        elem.addEventListener("dragover", dragover_handler);
        elem.addEventListener("drop", drop_handler);
    });
});

async function fetchBookings(startDate, endDate) {
    loadingModal = bootstrap.Modal.getInstance(document.querySelector("#loadingModal"));
    if (!loadingModal) {
        loadingModal = new bootstrap.Modal(document.querySelector("#loadingModal"));
    }

    loadingModal.show();

    bookings = [];
    allEntries = [];
    
    bookings = await fetch(`/api/bookings?isCancelled=false&checkInDateBefore=${encodeURIComponent(endDate.toString())}&checkOutDateAfter=${encodeURIComponent(startDate.toString())}`).then(response => response.json());
    
    for (let booking of bookings) {
        for (let room of booking.roomOccupations) {
            allEntries.push(new Entry(booking, room, booking.roomOccupations.indexOf(room)));
        }
    }

    updateVisibleEntries();
    loadingModal.hide();
}

function addBooking(date) {
    
}

function calendarGoToToday() {
    today = new Date();
    visibleStartOfWeek = new Date(getStartOfWeek(today).setHours(12,0,0,0));
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    
    fetchBookings(visibleStartOfWeek, visibleEndOfWeek);
    updateDateCells();
}

function calendarGoToPrevWeek() {
    visibleStartOfWeek = visibleStartOfWeek.subtractDays(7);
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    
    fetchBookings(visibleStartOfWeek, visibleEndOfWeek);
    updateDateCells();
}

function calendarGoToNextWeek() {
    visibleStartOfWeek = visibleStartOfWeek.addDays(7);
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    
    fetchBookings(visibleStartOfWeek, visibleEndOfWeek);
    updateDateCells();
}

function getStartOfWeek(date) {
    const output = new Date(date);
    const day = output.getDay() || 7;
    if (day !== 1) {
        output.setHours(-24 * (day - 1));
    }
    return output;
}

function updateDateCells() {
    for (let i=0; i<7; i++) {
        const currentDate = visibleStartOfWeek.addDays(i);
        dateCells[i].children[1].textContent = currentDate.getDate().toString().padStart(2, "0");
        dateCells[i].children[1].classList = 
            (currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()) ?
            "bg-primary rounded-5 d-inline-block px-1 text-light" : "";
    }

    const startMonth = visibleStartOfWeek.toLocaleString("en-us", {"month": "long", "year": "numeric"});
    const endMonth = visibleEndOfWeek.toLocaleString("en-us", {"month": "long", "year": "numeric"});

    currentMonthPlaceholder.textContent = (startMonth === endMonth) ? startMonth : `${startMonth} - ${endMonth}`;
}

function updateVisibleEntries() {
    document.querySelectorAll("td").forEach(elem => elem.innerHTML = "");
    roomRackRows = {};
    for (let entry of allEntries) {
        const checkInDate = new Date(new Date(entry.booking.checkInDate).setHours(12,0,0,0));
        const checkOutDate = new Date(new Date(entry.booking.checkOutDate).setHours(12,0,0,0));
        if (checkInDate <= visibleEndOfWeek && checkOutDate >= visibleStartOfWeek) {
            const node = document.createElement("div");
            node.id = `entry-${entry.booking.id}-${entry.room.number}-${entry.booking.roomOccupations.indexOf(entry.room)}`;
            node.className = "entry";
            node.setAttribute("data-bs-toggle", "modal");
            node.setAttribute("data-bs-target", "#bookingModal");
            node.setAttribute("draggable", "true");
            node.addEventListener("click", () => populateBookingConfirmation(entry.booking));
            node.addEventListener("dragstart", dragstart_handler);
            node.textContent = `${entry.booking.guest.lastName.toUpperCase()}, ${entry.booking.guest.firstName.toUpperCase()}`;
            
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
                document.querySelector(`#room-${entry.room.number}`).children[2].appendChild(node);
            }
            else {
                document.querySelector(`#room-${entry.room.number}`).children[Math.ceil(Math.abs(checkInDate - visibleStartOfWeek) / (1000 * 60 * 60 * 24)) + 2].appendChild(node);
            }

            if (roomRackRows[entry.room.number]) {
                if (!roomRackRows[entry.room.number].includes(entry)) {
                    roomRackRows[entry.room.number].push(entry);
                }
            }
            else {
                roomRackRows[entry.room.number] = [entry];
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
    for (let elem of allEntries) {
        if (checkIfTwoEntriesOverlap(entry, elem)) return true;
    }
    return false;
}

function checkIfTwoEntriesOverlap(e1, e2) {
    if (e1 !== e2 && e1.room.number === e2.room.number && (new Date(e1.booking.checkInDate).setHours(12,0,0,0)) < (new Date(e2.booking.checkOutDate).setHours(12,0,0,0)) && (new Date(e1.booking.checkOutDate).setHours(12,0,0,0)) > (new Date(e2.booking.checkInDate).setHours(12,0,0,0))) {
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

async function drop_handler(event) {
    event.preventDefault();
    const eventData = event.dataTransfer.getData("entryID").split("-");
    const roomNumber = parseInt(event.currentTarget.id.split("-")[1]);

    const entry = allEntries[allEntries.indexOf(allEntries.find(entry => entry.booking.id === eventData[1] && entry.room.number === parseInt(eventData[2]) && entry.index === parseInt(eventData[3])))];
    const booking = bookings[bookings.indexOf(bookings.find(booking => booking.id === entry.booking.id))];

    if (!loadingModal) {
        loadingModal = new bootstrap.Modal(document.querySelector("#loadingModal"));
    }
    loadingModal.show();

    const result = await fetch(`/api/changeBookingRoomOccupations/${booking.id}/${parseInt(eventData[2])}/${roomNumber}`);

    if (result.status === 200) {
        entry.room = rooms.find(room => room.number === roomNumber);
        booking.roomOccupations[entry.index] = entry.room;
    
        updateVisibleEntries();
    }
    else {
        const errorModal = new bootstrap.Modal(document.querySelector("#errorModal"));
        errorModal.show();
    }

    loadingModal.hide();
}

function populateBookingConfirmation(booking) {
    bookingToCancel = booking;
    document.querySelector("#bookingIDField").textContent = booking.id;
    document.querySelector("#bookingCheckInDateField").textContent = booking.strings.checkInDate;
    document.querySelector("#bookingCheckOutDateField").textContent = booking.strings.checkOutDate;
    document.querySelector("#bookingNumberOfGuestsField").textContent = booking.strings.guests;
    document.querySelector("#bookingTotalPriceField").textContent = booking.strings.totalPrice;

    document.querySelector("#roomRequestsContainer").innerHTML = "";
    for (let roomRequest of booking.roomRequests) {
        const divNode = document.createElement("div");
        divNode.classList.add("row", "align-items-center", "justify-content-center", "mb-3");
        const imgNode = document.createElement("img");
        imgNode.src = roomRequest.roomType.coverPhoto.source;
        imgNode.classList.add("col-6", "col-lg-3");
        imgNode.alt = roomRequest.roomType.coverPhoto.description;
        divNode.appendChild(imgNode);
        const pNode = document.createElement("p");
        pNode.classList.add("col-6", "col-lg-4");
        pNode.innerHTML = `${roomRequest.roomType.name} <span style="white-space: nowrap;">(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>${roomRequest.quantity})</span>`;
        divNode.appendChild(pNode);
        document.querySelector("#roomRequestsContainer").appendChild(divNode);
    }

    document.querySelector("#bookingGuestFirstNameField").textContent = booking.guest.firstName;
    document.querySelector("#bookingGuestLastNameField").textContent = booking.guest.lastName;
    document.querySelector("#bookingGuestEmailField").textContent = booking.guest.email;
    document.querySelector("#bookingGuestPhoneNumberField").textContent = booking.guest.phoneNumber;
    document.querySelector("#bookingGuestTravelsForWorkField").src = booking.strings.guestTravelsForWork.source;
    document.querySelector("#bookingGuestTravelsForWorkField").alt = booking.strings.guestTravelsForWork.description;
    document.querySelector("#bookingGuestTravelsForWorkField").height = booking.strings.guestTravelsForWork.height;
    document.querySelector("#bookingGuestAddressStreetField").textContent = booking.guest.address.street ? booking.guest.address.street : "Not specified";
    document.querySelector("#bookingGuestAddressStreetNoField").textContent = booking.guest.address.streetNo ? booking.guest.address.streetNo : "Not specified";
    document.querySelector("#bookingGuestAddressCityField").textContent = booking.guest.address.city ? booking.guest.address.city : "Not specified";
    document.querySelector("#bookingGuestAddressPostalCodeField").textContent = booking.guest.address.postalCode ? booking.guest.address.postalCode : "Not specified";
    document.querySelector("#bookingGuestAddressCountryField").textContent = booking.guest.address.country ? booking.guest.address.country : "Not specified";
    document.querySelector("#bookingBreakfastIncludedField").src = booking.strings.breakfastIncluded.source;
    document.querySelector("#bookingBreakfastIncludedField").alt = booking.strings.breakfastIncluded.description;
    document.querySelector("#bookingBreakfastIncludedField").height = booking.strings.breakfastIncluded.height;
    document.querySelector("#bookingFreeCancellationAllowedField").src = booking.strings.freeCancellationAllowed.source;
    document.querySelector("#bookingFreeCancellationAllowedField").alt = booking.strings.freeCancellationAllowed.description;
    document.querySelector("#bookingFreeCancellationAllowedField").height = booking.strings.freeCancellationAllowed.height;
}

function populateCancelConfirmation() {
    document.querySelector("#confirmationModalInfoMessage").innerHTML = `Are you sure you want to cancel ${bookingToCancel.guest.lastName}, ${bookingToCancel.guest.firstName}'s booking for ${bookingToCancel.strings.checkInDate} &#8211; ${bookingToCancel.strings.checkOutDate}?`;
    if (bookingToCancel.freeCancellationAllowed) {
        document.querySelector("#confirmationModalRefundMessage").textContent = `They will get a full refund, since they are entitled to free cancellation.`;
    }
    else {
        document.querySelector("#confirmationModalRefundMessage").textContent = `They will not get a refund, since they are not entitled to free cancellation.`;
    }
}

async function handleCancelConfirmation() {
    await fetch(`/api/cancelBooking/${bookingToCancel.id}`);
    location.reload();
}