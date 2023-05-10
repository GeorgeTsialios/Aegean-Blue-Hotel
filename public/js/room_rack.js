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

class Guest {
    constructor(firstName, lastName, email, phoneNumber, travelsForWork, country, city, postalCode, street, streetNo) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.travelsForWork = travelsForWork;
        this.country = country;
        this.city = city;
        this.postalCode = postalCode;
        this.street = street;
        this.streetNo = streetNo;
    }
}

class Booking {
    constructor(ID, checkInDate, checkOutDate, numberOfAdults, numberOfChildren, numberOfInfants, totalPrice, breakfastIncluded, freeCancellationAllowed, dateChangeAllowed, isCancelled, dateCreated, guest, roomNumber) {
        this.ID = ID;
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
        this.guest = guest;
        this.roomNumber = roomNumber;
    }
}

let dateCells;
let currentMonthPlaceholder;
let visibleStartOfWeek;
let visibleEndOfWeek;
let today;
let roomRackRows = {};
let roomOverlaps = {};

const guests = [
    new Guest("Konstantinos", "Papanikolaou", "k.papanikolaou@gmail.com", "+306944342414", false, "Greece", "Patras", "262 21", "Korinthou", "82"),
    new Guest("Nikos", "Papadopoulos", "nikos.papadopoulos@gmail.com", "+30 210 1234567", true, "Greece", "Athens", "105 62", "Stadiou", "13"),
    new Guest("Eleni", "Anastasiadou", "eleni.anastasiadou@yahoo.com", "+30 210 2345678", false, "Greece", "Thessaloniki", "546 26", "Themistokleous", "7"),
    new Guest("Stelios", "Karagiannis", "stelios.karagiannis@hotmail.com", "+30 210 3456789", true, "Greece", "Piraeus", "185 36", "Agiou Konstantinou", "25"),
    new Guest("Stavros", "Dimitriou", "stavros.dimitriou@yahoo.com", "+30 210 8901234", false, "Greece", "Kalamata", "241 00", "Dimokratias Square", "5"),
    new Guest("Katerina", "Triantafyllou", "katerina.triantafyllou@hotmail.com", "+30 210 9012345", true, "Greece", "Patra", "262 23", "Pireos", "22"),
    new Guest("Marina", "Andreou", "marina.andreou@hotmail.com", "+30 210 6789012", false, "Cyprus", "Nicosia", "1010", "Filikis Etaireias Square", "2"),
    new Guest("Alexandros", "Kontogiannis", "alexandros.kontogiannis@gmail.com", "+30 210 0123456", false, "Greece", "Larissa", "412 22", "Eleftheriou Venizelou", "17"),
    new Guest("Anna", "Mavrommati", "anna.mavrommati@gmail.com", "+30 210 4567890", false, "Greece", "Marousi", "151 22", "Kifissias", "31"),
    new Guest("Alexis", "Petridis", "alexis.petridis@yahoo.com", "+30 210 5678901", true, "Greece", "Athens", "106 82", "Alexandras", "11"),
    new Guest("Athina", "Sakellariou", "athina.sakellariou@gmail.com", "+30 210 7890123", true, "Greece", "Thessaloniki", "546 31", "Ethnikis Antistaseos", "16")
]

const bookings = [
    new Booking("NX7kEPpXqm", new Date(2023, 4, 2), new Date(2023, 4, 5), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[0], 101),
    new Booking("aW7nB3x9cJ", new Date(2023, 3, 29), new Date(2023, 4, 5), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[1], 102),
    new Booking("Dp4sT8qY2m", new Date(2023, 4, 3), new Date(2023, 4, 5), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[2], 103),
    new Booking("Gt1mL9yR7b", new Date(2023, 4, 5), new Date(2023, 4, 10), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[3], 103),
    new Booking("eF2jS4hP8N", new Date(2023, 4, 1), new Date(2023, 4, 2), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[4], 104),
    new Booking("iK6gM7fZ1L", new Date(2023, 4, 2), new Date(2023, 4, 3), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[5], 104),
    new Booking("Hx5pJ9cD6V", new Date(2023, 4, 3), new Date(2023, 4, 7), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[6], 105),
    new Booking("qT4oR6sN8G", new Date(2023, 4, 3), new Date(2023, 4, 7), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[6], 106),
    new Booking("Vw3yX7bU1f", new Date(2023, 3, 27), new Date(2023, 4, 2), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[7], 107),
    new Booking("kS2gH9tE4j", new Date(2023, 3, 20), new Date(2023, 4, 13), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[8], 108),
    new Booking("lP6zN1dQ8m", new Date(2023, 4, 4), new Date(2023, 4, 6), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[9], 109),
    new Booking("Bv9jF5cT7a", new Date(2023, 4, 2), new Date(2023, 4, 6), 2, 1, 0, 240.34, true, true, true, false, new Date(2023, 2, 4), guests[10], 110)
];

document.addEventListener("DOMContentLoaded", () => {
    dateCells = document.querySelectorAll(".dayHeader");
    currentMonthPlaceholder = document.querySelector("#calendarCurrentMonth");

    calendarGoToToday();

    document.querySelector("#calendarButtonToday").addEventListener("click", calendarGoToToday);
    document.querySelector("#calendarButtonPrev").addEventListener("click", calendarGoToPrevWeek);
    document.querySelector("#calendarButtonNext").addEventListener("click", calendarGoToNextWeek);

    document.querySelectorAll("tbody tr").forEach(elem => {
        elem.addEventListener("dragover", dragover_handler);
        elem.addEventListener("drop", drop_handler);
    });
})

function addBooking(date) {
    
}

function calendarGoToToday() {
    today = new Date();
    visibleStartOfWeek = new Date(getStartOfWeek(today).setHours(0,0,0,0));
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    updateDateCells();
    updateVisibleBookings();
}

function calendarGoToPrevWeek() {
    visibleStartOfWeek = visibleStartOfWeek.subtractDays(7);
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    updateDateCells();
    updateVisibleBookings();
}

function calendarGoToNextWeek() {
    visibleStartOfWeek = visibleStartOfWeek.addDays(7);
    visibleEndOfWeek = visibleStartOfWeek.addDays(6);
    updateDateCells();
    updateVisibleBookings();
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

    const startMonth = visibleStartOfWeek.toLocaleString("default", {"month": "long", "year": "numeric"});
    const endMonth = visibleEndOfWeek.toLocaleString("default", {"month": "long", "year": "numeric"});

    currentMonthPlaceholder.textContent = (startMonth === endMonth) ? startMonth : `${startMonth} - ${endMonth}`;
}

function updateVisibleBookings() {
    document.querySelectorAll("td").forEach(elem => elem.innerHTML = "");
    roomRackRows = {};

    for (let booking of bookings) {
        if (booking.checkInDate <= visibleEndOfWeek && booking.checkOutDate >= visibleStartOfWeek) {
            const node = document.createElement("div");
            node.setAttribute("data-bs-toggle", "modal");
            node.setAttribute("data-bs-target", "#bookingModal");
            node.className = "bookingEntry";
            node.addEventListener("dragstart", dragstart_handler);
            node.id = `booking-${booking.ID}`;
            node.setAttribute("draggable", "true");
            node.textContent = `${booking.guest.lastName.toUpperCase()}, ${booking.guest.firstName.toUpperCase()}`;

            if (booking.checkInDate < visibleStartOfWeek) {
                node.classList.add("extendsLeft");
            }
            if (booking.checkOutDate > visibleEndOfWeek) {
                node.classList.add("extendsRight");
            }

            if (booking.checkInDate >= visibleStartOfWeek && booking.checkOutDate <= visibleEndOfWeek) {
                node.style.width = `${Math.ceil(Math.abs(booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)) * 100}%`;
            }
            else if (booking.checkInDate < visibleStartOfWeek && booking.checkOutDate <= visibleEndOfWeek) {
                node.style.width = `${Math.ceil(Math.abs(booking.checkOutDate - visibleStartOfWeek) / (1000 * 60 * 60 * 24)) * 100 + 50}%`;
            }
            else if (booking.checkInDate >= visibleStartOfWeek && booking.checkOutDate > visibleEndOfWeek) {
                node.style.width = `${Math.ceil(Math.abs(visibleEndOfWeek - booking.checkInDate) / (1000 * 60 * 60 * 24)) * 100 + 50}%`;
            }
            else {
                node.style.width = "700%";
            }

            if (booking.checkInDate <= visibleStartOfWeek) {
                document.querySelector(`#room-${booking.roomNumber}`).children[2].appendChild(node);
            }
            else {
                document.querySelector(`#room-${booking.roomNumber}`).children[Math.ceil(Math.abs(booking.checkInDate - visibleStartOfWeek) / (1000 * 60 * 60 * 24)) + 2].appendChild(node);
            }

            if (roomRackRows[booking.roomNumber]) {
                if (!roomRackRows[booking.roomNumber].includes(booking)) {
                    roomRackRows[booking.roomNumber].push(booking);
                }
            }
            else {
                roomRackRows[booking.roomNumber] = [booking];
            }
        }
    }

    arrangeOverlappingBookings();
}

function arrangeOverlappingBookings() {
    for (let room of Object.keys(roomRackRows)) {
        const arrangementRows = [[]];

        for (let booking of roomRackRows[room]) {
            (bookingHasOverlaps(booking)) ? document.querySelector(`#booking-${booking.ID}`).classList.add("overlapping") : document.querySelector(`#booking-${booking.ID}`).classList.remove("overlapping");
            let i = 0;
            while (i < arrangementRows.length) {
                if (arrangementRows[i].every(elem => !checkIfTwoBookingsOverlap(elem, booking))) {
                    arrangementRows[i].push(booking);
                    break;
                }
                i++;
            }
            if (i >= arrangementRows.length) {
                arrangementRows.push([booking]);
            }
        }

        for (let i=0; i<arrangementRows.length; i++) {
            for (let booking of arrangementRows[i]) {
                document.querySelector(`#booking-${booking.ID}`).style.top = `${i * 25}px`;
            }
        }

        document.querySelector(`#room-${room}`).style.height = `${arrangementRows.length * 25}px`;
    }
}

function bookingHasOverlaps(booking) {
    for (let elem of bookings) {
        if (checkIfTwoBookingsOverlap(booking, elem)) return true;
    }
    return false;
}

function checkIfTwoBookingsOverlap(b1, b2) {
    if (b1 !== b2 && b1.roomNumber === b2.roomNumber && b1.checkInDate < b2.checkOutDate && b1.checkOutDate > b2.checkInDate) {
        return true;
    }
    else {
        return false;
    }
}

function dragstart_handler(event) {
    event.dataTransfer.setData("bookingID", event.currentTarget.id);
    event.dataTransfer.setData("columnIndex", Array.from(event.currentTarget.parentElement.parentElement.children).indexOf(event.currentTarget.parentElement));
}

function dragover_handler(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function drop_handler(event) {
    event.preventDefault();

    const booking = bookings.find(booking => booking.ID === event.dataTransfer.getData("bookingID").split("-")[1]);
    booking.roomNumber = parseInt(event.currentTarget.id.split("-")[1]);

    updateVisibleBookings();
}