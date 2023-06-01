const guests = {
    "adultsCount": 0,
    "childrenCount": 0,
    "infantsCount": 0
}

const dates = {
    "check-in": originalDates["check-in"],
    "check-out": originalDates["check-out"]
}

let TotalPrice = 0;
let TotalPriceWithDiscount = 0;
let Discount = 0;

document.addEventListener("DOMContentLoaded", async () => {
    updateGuests("adultsCount","NULL");
    updateGuests("childrenCount","NULL");
    updateGuests("infantsCount","NULL");
    document.querySelector("#adultsCountMinus").addEventListener("click", () => updateGuests("adultsCount", "Minus"));
    document.querySelector("#adultsCountPlus").addEventListener("click", () => updateGuests("adultsCount", "Plus"));
    document.querySelector("#childrenCountMinus").addEventListener("click", () => updateGuests("childrenCount", "Minus"));
    document.querySelector("#childrenCountPlus").addEventListener("click", () => updateGuests("childrenCount", "Plus"));
    document.querySelector("#infantsCountMinus").addEventListener("click", () => updateGuests("infantsCount", "Minus"));
    document.querySelector("#infantsCountPlus").addEventListener("click", () => updateGuests("infantsCount", "Plus"));

    document.querySelector("#BreakfastIncluded").addEventListener("change",() => {
        updateTotal();
        document.querySelector("#BreakfastIncludedForm").value = document.querySelector("#BreakfastIncluded").checked;
    });
    document.querySelector("#FreeCancellation").addEventListener("change",() => {
        updateTotal();
        document.querySelector("#FreeCanellationIncludedForm").value = document.querySelector("#FreeCancellation").checked;
    });

    roomTypes.forEach((roomType) => {
        document.querySelector(`#${roomType[0].code}PlusWrapper`).setAttribute("data-bs-title","No more rooms available.");
        let PlusTooltipTriggerList = document.querySelectorAll(`#${roomType[0].code}PlusWrapper`);
        let PlusTooltipList = [...PlusTooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    });

    roomTypes.forEach((roomType) => {
        initializePlusButtons(roomType);
        document.querySelector(`#${roomType[0].code}CountPlus`).addEventListener("click", () => {updateRooms(roomType, "Plus");  updateTotal();} );
        document.querySelector(`#${roomType[0].code}CountMinus`).addEventListener("click", () => {updateRooms(roomType, "Minus"); updateTotal();} );
    });

    insertRedStatements();

    const countButtons = document.querySelectorAll(".countButton");
    countButtons.forEach((Button) => Button.addEventListener('click',() => checkFormChange()));

    document.querySelector("#BookButtonWrapper").setAttribute("data-bs-title",`You need space for ${originalGuests["numberOfGuests"]} more ${(originalGuests["numberOfGuests"] === 1)?"person":"people"}.`);
    const BookTooltipTriggerList = document.querySelectorAll('#BookButtonWrapper');
    const BookTooltipList = [...BookTooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const modalLinks = document.querySelectorAll(".modal-link");
    modalLinks.forEach((modalLink) =>  modalLink.addEventListener('click',populateModal));

    document.querySelector("#search").addEventListener("click",populateForm1);
    document.querySelector("#BookButton").addEventListener("click",populateForm2);

})

function insertRedStatements() {
    availableRoomTypes.forEach((roomType) => {
        if (Number(roomType.count) <= 3) {
            const redStatement = document.createElement('div');
            redStatement.classList.add("red-statement");
            redStatement.classList.add("mt-1"); 
            redStatement.classList.add("mt-lg-3");
            if (Number(roomType.count) === 0)
                redStatement.innerHTML = `No rooms left`;
            else 
                redStatement.innerHTML = `Only ${roomType.count} ${Number(roomType.count) === 1 ? "room" : "rooms"} left`;
            document.querySelector(`#${roomType.code}FirstCell`).appendChild(redStatement);
        }
    });
}

function populateForm2() {
    document.querySelector("#checkInDateForm2").value = originalDates["check-in"].toLocaleDateString("en-us");
    document.querySelector("#checkOutDateForm2").value = originalDates["check-out"].toLocaleDateString("en-us");

    document.querySelector("#adultsCountForm2").value = originalGuests["adultsCount"];
    document.querySelector("#childrenCountForm2").value = originalGuests["childrenCount"];
    document.querySelector("#infantsCountForm2").value = originalGuests["infantsCount"];
}

function populateForm1() {
    document.querySelector("#checkInDateForm1").value = dates["check-in"]? dates["check-in"].toLocaleDateString("en-us"):originalDates["check-in"].toLocaleDateString("en-us");
    document.querySelector("#checkOutDateForm1").value = dates["check-out"]?dates["check-out"].toLocaleDateString("en-us"):originalDates["check-out"].toLocaleDateString("en-us");
    document.querySelector("#adultsCountForm1").value = guests["adultsCount"];
    document.querySelector("#childrenCountForm1").value = guests["childrenCount"];
    document.querySelector("#infantsCountForm1").value = guests["infantsCount"];
}

function populateModal(event) {
    const linkClicked = event.target.id.split("-")[0];

    const roomType = roomTypes.find((roomType) => roomType[0].code === linkClicked)[0];
    populateRoomTypeModal(roomType);
}

function initializePlusButtons(roomType) {
    const upperLimit = Number(availableRoomTypes.find((availableRoomType) => availableRoomType.code === roomType[0].code).count);
    const tooltip = bootstrap.Tooltip.getInstance(`#${roomType[0].code}PlusWrapper`);   
    
    document.querySelector(`#${roomType[0].code}CountPlus`).disabled = (roomType[1] >= upperLimit);
    
    if (roomType[1] >= upperLimit) 
        tooltip.enable();
    else 
        tooltip.disable();
}

function updateRooms(roomType, symbol) {
    const lowerLimit = 0;
    const upperLimit = Number(availableRoomTypes.find((availableRoomType) => availableRoomType.code === roomType[0].code).count);
    const tooltip = bootstrap.Tooltip.getInstance(`#${roomType[0].code}PlusWrapper`);   

    (symbol === "Minus") ? roomType[1]-- : roomType[1]++;

    document.querySelector(`#${roomType[0].code}CountForm`).value = roomType[1];
    
    document.querySelector(`#${roomType[0].code}CountMinus`).disabled = (roomType[1] <= lowerLimit);
    document.querySelector(`#${roomType[0].code}CountPlus`).disabled = (roomType[1] >= upperLimit);
    if (roomType[1] >= upperLimit) {
        tooltip.enable();
        tooltip.show();
    }
    else 
        tooltip.disable();

    document.querySelector(`#${roomType[0].code}Count`).textContent = roomType[1];
}

function updateTotal() {
    TotalPrice = 0;
    TotalPriceWithDiscount = 0;
    Discount = 0;
    let totalCapacity = 0;
    let freeCancellationSelected = document.querySelector("#FreeCancellation").checked;
    let breakfastSelected = document.querySelector("#BreakfastIncluded").checked;

    roomTypes.forEach((roomType) => TotalPrice += (originalDates["numberOfNights"] * roomType[1] * roomType[0].price * (freeCancellationSelected?freeCancellationCoefficient:1)));
    if (TotalPrice !== 0) {
        TotalPrice += breakfastSelected?(originalGuests["numberOfGuests"] * originalDates["numberOfNights"] * breakfastPriceperNightperPerson):0;
        if (account && account.accountLevel.discount !== 0){
            Discount = TotalPrice * (account.accountLevel.discount);
            TotalPriceWithDiscount = TotalPrice - Discount;
            if (!Number.isInteger(TotalPrice))
                TotalPrice = TotalPrice.toFixed(2);
            if (!Number.isInteger(Discount))
                Discount = Discount.toFixed(2);
            if (!Number.isInteger(TotalPriceWithDiscount)) 
                TotalPriceWithDiscount = TotalPriceWithDiscount.toFixed(2);
            document.querySelector("#totalPrice").innerHTML = `Total Price: <span id="oldPrice">${TotalPrice}&euro;</span> ${TotalPriceWithDiscount}&euro;`;
            document.querySelector("#offcanvasButton>span").innerHTML = `${TotalPriceWithDiscount}&euro;`;
            document.querySelector("#price_policies").innerHTML = `<li class="fw-semibold">You are saving ${Discount}&euro; with your ${account.accountLevel.name} account.</li><li>All taxes are included in this price.</li><li>Every customer is entitled to one free change of dates for their booking.</li>`;
        }
        else {
            if (!Number.isInteger(TotalPrice))
                TotalPrice = TotalPrice.toFixed(2);
            document.querySelector("#totalPrice").innerHTML = `Total Price: ${TotalPrice}&euro;`;
            document.querySelector("#offcanvasButton>span").innerHTML = `${TotalPrice}&euro;`;
            document.querySelector("#price_policies").innerHTML = `<li>All taxes are included in this price.</li><li>Every customer is entitled to one free change of dates for their booking.</li>`;
        }
    }
    else { // When TotalPrice = 0
        document.querySelector("#totalPrice").innerHTML = `Total Price: ${TotalPrice}&euro;`;
        document.querySelector("#offcanvasButton>span").innerHTML = `${TotalPrice}&euro;`;
        document.querySelector("#price_policies").innerHTML = `<li>All taxes are included in this price.</li><li>Every customer is entitled to one free change of dates for their booking.</li>`;
    }
    for (let roomType of roomTypes)
        totalCapacity += roomType[0].capacity * roomType[1];
    document.querySelector("#BookButton").disabled = (totalCapacity < originalGuests["numberOfGuests"]);

    const tooltip = bootstrap.Tooltip.getInstance('#BookButtonWrapper');
    if (originalGuests["numberOfGuests"] - totalCapacity <= 0) {
        tooltip.disable();
    }
    else {
        tooltip.enable();
        document.querySelector("#BookButtonWrapper").setAttribute("data-bs-title",`You need space for ${originalGuests["numberOfGuests"] - totalCapacity} more ${(originalGuests["numberOfGuests"] - totalCapacity === 1)?"person":"people"}.`);
        const BookTooltipTriggerList = document.querySelectorAll('#BookButtonWrapper')
        const BookTooltipList = [...BookTooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }
} 

function updateGuests(elem, symbol) {
    const lowerLimit = (elem === "adultsCount") ? 1 : 0;

    switch (symbol) {
        case "Minus":
            guests[elem]--;
            break;
        case "Plus":
            guests[elem]++;
            break;
        default:
            // Initialization
            guests[elem] = originalGuests[elem];
    }

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
            checkFormChange();
        }
    );
});