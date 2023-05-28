const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", () => {

    form.action = "/fromBank";
    document.querySelector("#bookingInfo").value = JSON.stringify(bookingInfo);
    setTimeout(() => {
        form.submit();
    },5000);
});