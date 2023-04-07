const guests = {
    "adultsCount": 1,
    "childrenCount": 0,
    "infantsCount": 0
}

const rooms = {
    "EXEDD": {
        "Count":0,
        "Price":150
    },

    "DLX": {
        "Count":0,
        "Price":180
    }
}

let TotalPrice = 0;

const dates = {
    "check-in": null,
    "check-out": null
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#adultsCountMinus").addEventListener("click", () => updateGuests("adultsCount", "Minus"));
    document.querySelector("#adultsCountPlus").addEventListener("click", () => updateGuests("adultsCount", "Plus"));
    document.querySelector("#childrenCountMinus").addEventListener("click", () => updateGuests("childrenCount", "Minus"));
    document.querySelector("#childrenCountPlus").addEventListener("click", () => updateGuests("childrenCount", "Plus"));
    document.querySelector("#infantsCountMinus").addEventListener("click", () => updateGuests("infantsCount", "Minus"));
    document.querySelector("#infantsCountPlus").addEventListener("click", () => updateGuests("infantsCount", "Plus"));

    document.querySelector("#EXEDDCountPlus").addEventListener("click", () => {updateRooms("EXEDD", "Plus");  updateTotal();} );
    document.querySelector("#EXEDDCountMinus").addEventListener("click", () => {updateRooms("EXEDD", "Minus"); updateTotal();} );
    document.querySelector("#DLXCountPlus").addEventListener("click", () => {updateRooms("DLX", "Plus"); updateTotal();} );
    document.querySelector("#DLXCountMinus").addEventListener("click", () => {updateRooms("DLX", "Minus"); updateTotal();} );
})


function updateRooms(elem, symbol) {
    const lowerLimit = 0;
    (symbol === "Minus") ? rooms[elem].Count-- : rooms[elem].Count++;
    
    document.querySelector(`#${elem}CountMinus`).disabled = (rooms[elem].Count <= lowerLimit);
    document.querySelector(`#${elem}CountPlus`).disabled = (rooms[elem].Count >= 9);
    
    document.querySelector(`#${elem}Count`).textContent = rooms[elem].Count;
}

function updateTotal() {
    TotalPrice = 0;
    Object.values(rooms).forEach((room) => TotalPrice += (room.Count * room.Price)); 
    document.querySelector("#totalPrice").innerHTML = `Total Price: ${TotalPrice}&euro;`;
    document.querySelector("#offcanvasButton>span").innerHTML = `${TotalPrice}&euro;`;
    document.querySelector("#BookButton").disabled = (TotalPrice === 0);
}

function updateGuests(elem, symbol) {
    const lowerLimit = (elem === "adultsCount") ? 1 : 0;
    (symbol === "Minus") ? guests[elem]-- : guests[elem]++;

    document.querySelector(`#${elem}Minus`).disabled = (guests[elem] <= lowerLimit);
    document.querySelector(`#${elem}Plus`).disabled = (guests[elem] >= 9);

    document.querySelector(`#${elem}`).textContent = guests[elem];
    document.querySelector("#guests").innerHTML = `${guests['adultsCount']} ${(guests['adultsCount'] === 1) ? "adult" : "adults"} &bull; ${guests['childrenCount']} ${(guests['childrenCount'] === 1) ? "child" : "children"} &bull; ${guests['infantsCount']} ${(guests['infantsCount'] === 1) ? "infant" : "infants"}`;
}


$(() => {
    $('#daterange').daterangepicker(
        {
            startDate: new Date(2023,3,28),
            endDate: new Date(2023,4,1),
            drops: 'down',
            minDate: new Date(),
            autoApply: true
        },
        (start, end) => {
            dates['check-in'] = start.toDate();
            dates['check-out'] = end.toDate();
            document.querySelector("#daterange").innerHTML = `${dates['check-in'].toLocaleDateString("default", {"month": "short", "day": "numeric", "year": "numeric"})} &#8211 ${dates['check-out'].toLocaleDateString("default", {"month": "short", "day": "numeric", "year": "numeric"})}`
        }
    );
});