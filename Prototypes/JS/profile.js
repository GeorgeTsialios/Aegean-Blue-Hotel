const dates = {
    "check-in": null,
    "check-out": null
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cancelBookingButton").forEach((elem) => elem.addEventListener("click", () => populateModal(elem)));
    document.querySelectorAll(".changeDatesButton").forEach((elem) => elem.addEventListener("click", () => populateModal(elem)));
    document.querySelector("#daterange").addEventListener("click", changeDatepickerDisplayProperty);
    document.querySelector("#fileInputVisible").addEventListener("click", () => {
        document.querySelector("#fileInputHidden").click();
    })
    document.querySelector("#fileInputHidden").addEventListener("change", updateProfilePhoto);
})

function populateModal(elem) {
    dates["check-in"] = new Date(elem.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent.split("–")[0].trim());
    dates["check-out"] = new Date(elem.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent.split("–")[1].trim());

    switch (elem.textContent) {
        case "Cancel": {
            document.querySelector("#modalLabel").textContent = "Booking cancellation";
            document.querySelector("#modalMessage").innerHTML = `Are you sure you want to cancel your booking for ${elem.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent.trim()}?`;
            
            if (Math.random() >= 0.5) {
                document.querySelector("#modalRefund").textContent = "You will get a full refund, since you are entitled to free cancellation.";
            }
            else {
                document.querySelector("#modalRefund").textContent = "You won't get a refund, since you are not entitled to free cancellation.";
            }

            document.querySelector("#modalRefund").style.display = "block";
            document.querySelector("#daterange").style.display = "none";
            document.querySelector("#modalActionWarning").style.display = "block";
            document.querySelector("#modalButton").classList.remove("btn-success");
            document.querySelector("#modalButton").classList.add("btn-danger");
            document.querySelector("#modalButton").textContent = "Yes, cancel booking";
            document.querySelector("#modalButton").style.display = "block";
            break;
        }
        case "Change dates": {
            document.querySelector("#modalLabel").textContent = "Change booking dates";
            document.querySelector("#modalMessage").innerHTML = `Are you sure you want to change the dates of your booking for ${elem.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent.trim()}?`;

            if (Math.random() >= 0.5) {
                document.querySelector("#modalMessage").innerHTML = "You are entitled for one free change of booking dates.";
                document.querySelector("#modalButton").style.display = "block";
                document.querySelector("#daterange").style.display = "block";
                document.querySelector("#daterange").textContent = elem.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].textContent;
                $(() => {
                    $('#daterange').daterangepicker(
                        {
                            startDate: dates['check-in'],
                            endDate: dates['check-out'],
                            drops: 'down',
                            opens: 'center',
                            minDate: new Date(),
                            autoApply: true,
                            parentEl: $(".modal-body")
                        },
                        (start, end) => {
                            dates['check-in'] = start.toDate();
                            dates['check-out'] = end.toDate();
                            document.querySelector("#daterange").innerHTML = `${dates['check-in'].toLocaleDateString("default", {"month": "short", "day": "numeric", "year": "numeric"})} &#8211 ${dates['check-out'].toLocaleDateString("default", {"month": "short", "day": "numeric", "year": "numeric"})}`
                        }
                    );
                    document.querySelector(".daterangepicker.show-calendar").style.display = "none";
                });
            }
            else {
                document.querySelector("#modalMessage").innerHTML = "You have already changed the booking dates once. You are not allowed to make changes anymore.";
                document.querySelector("#modalButton").style.display = "none";
                document.querySelector("#daterange").style.display = "none";
            }

            document.querySelector("#modalRefund").style.display = "none";
            document.querySelector("#modalActionWarning").style.display = "none";
            document.querySelector("#modalButton").classList.remove("btn-danger");
            document.querySelector("#modalButton").classList.add("btn-success");
            document.querySelector("#modalButton").textContent = "Confirm change";
            break;
        }
    }
}

function changeDatepickerDisplayProperty() {
    const datepicker = document.querySelector(".daterangepicker.show-calendar");
    datepicker.style.display = "flex";
}

function updateProfilePhoto() {
    const profilePhotoContainer = document.querySelector("#profilePhotoContainer");
    profilePhotoContainer.innerHTML = "";
    const img = document.createElement("img");
    img.classList.add("card-img-top", "mt-3", "profilePhotoImg");
    img.src = URL.createObjectURL(document.querySelector("#fileInputHidden").files[0]);
    profilePhotoContainer.appendChild(img);
}
