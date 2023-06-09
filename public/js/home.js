Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const guests = {
    "adultsCount": 1,
    "childrenCount": 0,
    "infantsCount": 0
}
const dates = {
    "check-in": new Date().addDays(1),
    "check-out": new Date().addDays(2)
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#searchForm").addEventListener("submit", () => sendForm());

    document.querySelector("#adultsCountMinus").addEventListener("click", () => updateGuests("adultsCount", "Minus"));
    document.querySelector("#adultsCountPlus").addEventListener("click", () => updateGuests("adultsCount", "Plus"));
    document.querySelector("#childrenCountMinus").addEventListener("click", () => updateGuests("childrenCount", "Minus"));
    document.querySelector("#childrenCountPlus").addEventListener("click", () => updateGuests("childrenCount", "Plus"));
    document.querySelector("#infantsCountMinus").addEventListener("click", () => updateGuests("infantsCount", "Minus"));
    document.querySelector("#infantsCountPlus").addEventListener("click", () => updateGuests("infantsCount", "Plus"));
})

function updateGuests(elem, symbol) {
    const lowerLimit = (elem === "adultsCount") ? 1 : 0;
    (symbol === "Minus") ? guests[elem]-- : guests[elem]++;

    document.querySelector(`#${elem}Minus`).disabled = (guests[elem] <= lowerLimit);
    document.querySelector(`#${elem}Plus`).disabled = (guests[elem] >= 9);

    document.querySelector(`#${elem}`).textContent = guests[elem];
    document.querySelector("#guests").innerHTML = `${guests['adultsCount']} ${(guests['adultsCount'] === 1) ? "adult" : "adults"} &bull; ${guests['childrenCount']} ${(guests['childrenCount'] === 1) ? "child" : "children"} &bull; ${guests['infantsCount']} ${(guests['infantsCount'] === 1) ? "infant" : "infants"}`;
}

function sendForm() {
    document.querySelector("input[name=checkInDate]").value = dates['check-in'].toLocaleDateString("en-us");
    document.querySelector("input[name=checkOutDate]").value = dates['check-out'].toLocaleDateString("en-us");
    document.querySelector("input[name=adultsCount]").value = guests['adultsCount'];
    document.querySelector("input[name=childrenCount]").value = guests['childrenCount'];
    document.querySelector("input[name=infantsCount]").value = guests['infantsCount'];
}

$(() => {
    $('#daterange').daterangepicker(
        {
            drops: 'up',
            minDate: new Date(),
            autoApply: true,
            maxSpan: {
                "days": 30
            },
            minSpan: {
                "days": 1
            }
        },
        (start, end) => {
            dates['check-in'] = start.toDate();
            dates['check-out'] = end.toDate();
            document.querySelector("#daterange").innerHTML = `${dates['check-in'].toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"})} &#8211 ${dates['check-out'].toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"})}`
        }
    );
});