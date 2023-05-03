document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".bookingEntry").forEach((elem) => {
        elem.addEventListener("dragstart", dragstart_handler);
    });
    document.querySelectorAll("td").forEach((elem) => {
        elem.addEventListener("dragover", dragover_handler);
        elem.addEventListener("dragleave", dragleave_handler);
        elem.addEventListener("drop", drop_handler);
    });
})

function addBooking(date) {
    
}

function dragstart_handler(event) {
    console.log(event);
    event.dataTransfer.setData("text/plain", event.currentTarget.id);
    event.dataTransfer.dropEffect = "move";
}

function dragover_handler(event) {
    event.currentTarget.style.border = "1px dashed black";
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function dragleave_handler(event) {
    event.currentTarget.style.border = "0";
    event.currentTarget.style.borderColor = "inherit";
    event.currentTarget.style.borderStyle = "solid";
    event.currentTarget.style.borderBottomWidth = "1px";
}

function drop_handler(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    event.currentTarget.appendChild(document.querySelector(`#${data}`));
    dragleave_handler(event);
}