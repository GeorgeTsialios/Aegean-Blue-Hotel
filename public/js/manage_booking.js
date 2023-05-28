document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#modalButton").addEventListener("click", handleModalResult);
    document.querySelectorAll(".cancelBookingButton").forEach((elem) => elem.addEventListener("click", populateModal));
    document.querySelectorAll(".changeDatesButton").forEach((elem) => elem.addEventListener("click", populateModal));
});

function populateModal(event) {
    switch (event.currentTarget.textContent) {
        case "Cancel": {
            document.querySelector("#modalLabel").textContent = "Booking cancellation";
            document.querySelector("#modalMessage").innerHTML = `Are you sure you want to cancel your booking for ${booking.strings.checkInDate} &#8211; ${booking.strings.checkOutDate}?`;
            
            if (booking.freeCancellationAllowed) {
                document.querySelector("#modalRefund").textContent = "You will get a full refund, since you are entitled to free cancellation.";
            }
            else {
                document.querySelector("#modalRefund").textContent = "You won't get a refund, since you are not entitled to free cancellation.";
            }

            document.querySelector("#modalRefund").style.display = "block";
            document.querySelector("#daterange").style.display = "none";
            document.querySelector("#modalButton").classList.remove("btn-success");
            document.querySelector("#modalButton").classList.add("btn-danger");
            document.querySelector("#modalButton").textContent = "Yes, cancel booking";
            document.querySelector("#modalButton").style.display = "block";
            break;
        }
        case "Change dates": {
            document.querySelector("#modalLabel").textContent = "Change booking dates";
            document.querySelector("#modalMessage").innerHTML = `Are you sure you want to change the dates of your booking for ${booking.strings.checkInDate} &#8211; ${booking.strings.checkOutDate}?`;

            if (booking.dateChangeAllowed) {
                document.querySelector("#modalMessage").innerHTML = "You are entitled for one free change of booking dates.";
                document.querySelector("#modalButton").style.display = "block";
                document.querySelector("#daterange").style.display = "block";
                document.querySelector("#daterange").innerHTML = `${booking.strings.checkInDate} &#8211; ${booking.strings.checkOutDate}`;
                $(() => {
                    $('#daterange').daterangepicker(
                        {
                            startDate: dates['check-in'],
                            endDate: dates['check-out'],
                            drops: 'down',
                            opens: 'center',
                            minDate: new Date(),
                            minSpan: {
                                days: (dates['check-out'].getTime() - dates['check-in'].getTime()) / (1000 * 3600 * 24)
                            },
                            maxSpan: {
                                days: (dates['check-out'].getTime() - dates['check-in'].getTime()) / (1000 * 3600 * 24)
                            },
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
                document.querySelector("#modalActionWarning").style.display = "none";
                document.querySelector("#daterange").style.display = "none";
            }

            document.querySelector("#modalRefund").style.display = "none";
            document.querySelector("#modalButton").classList.remove("btn-danger");
            document.querySelector("#modalButton").classList.add("btn-success");
            document.querySelector("#modalButton").textContent = "Confirm change";
            break;
        }
    }
}

async function handleModalResult(event) {
    if (event.currentTarget.textContent === "Yes, cancel booking") {
        await fetch(`/api/cancelBooking/${booking.id}`);
        location.reload();
    }
    else if (event.currentTarget.textContent === "Confirm change") {
        if (originalDates["check-in"].getTime() !== dates["check-in"].getTime() && originalDates["check-out"].getTime() !== dates["check-out"].getTime()) {
            const result = await fetch(`/api/changeBookingDates/${booking.id}/${dates["check-in"].toLocaleDateString().replaceAll('/','-')}/${dates["check-out"].toLocaleDateString().replaceAll('/','-')}`);

            if (result.status === 200) {
                location.reload();
            }
            else if (result.status === 403) {
                document.querySelector(".error").style.cssText = "display: flex !important;";
            }
        }
    }
}
