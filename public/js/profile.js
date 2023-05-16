const originalDates = {
    "check-in": null,
    "check-out": null
}
const dates = {
    "check-in": null,
    "check-out": null
};

const lengthRegex = /^.{8,32}$/;
const numberRegex = /^.*[0-9]+.*$/;
const lowerCaseRegex = /^.*[a-z]+.*$/;
const upperCaseRegex = /^.*[A-Z]+.*$/;
const specialCharacterRegex = /^.*[*.!@$%^&(){}[\]:;<>,.?\/~_\+\-=|\\]+.*$/;

const oldPassword = document.querySelector("#old_password");
const newPassword = document.querySelector("#new_password");
const repeatPassword = document.querySelector("#repeat_password");

const phoneRegex = /^[0-9\(\)\-\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneContainer = document.querySelector("#phone_container");

const errorMap = {
    "-99": "Please provide a valid phone number",
    0:"Invalid number",
    1:"Invalid country code",
    2:"Too short",
    3:"Too long",
    4:"Invalid number"
};

let iti = initializeIti();
const PhoneDropdown = document.querySelector("#iti-0__country-listbox");

let account = null;
const accountBookings = [];
let bookingToEdit = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchAccount();
    fetchAccountBookings();
    
    document.querySelector(".iti__flag-container").addEventListener("click", setPhoneDropdownSize);
    window.addEventListener('resize',setPhoneDropdownSize);
    document.querySelector("#e-mail").addEventListener("keyup", validateEmail);
    document.querySelector("#phone").addEventListener("keyup", validatePhone);
    document.querySelector("#phone").addEventListener("focus", validatePhone);
    oldPassword.addEventListener("keyup", () => {
        validatePassword(oldPassword);
    });
    newPassword.addEventListener("keyup", () => {
        validatePassword(newPassword);
        validateRepeatPassword();
    });
    repeatPassword.addEventListener("keyup", validateRepeatPassword);
    document.querySelector("#modalButton").addEventListener("click", handleModalResult);
    document.querySelector("#editProfileButton").addEventListener("click", populateProfileInfo);
    document.querySelector("#saveProfileButton").addEventListener("click", handleSaveProfile);
    document.querySelector("#changePasswordButton").addEventListener("click", handleChangePassword);
    document.querySelectorAll(".cancelBookingButton").forEach((elem) => elem.addEventListener("click", populateModal));
    document.querySelectorAll(".changeDatesButton").forEach((elem) => elem.addEventListener("click", populateModal));
    document.querySelector("#fileInputVisible").addEventListener("click", () => {
        document.querySelector("#fileInputHidden").click();
    })
    document.querySelector("#fileInputHidden").addEventListener("change", updateProfilePhoto);
})

async function fetchAccount() {
    const response = await fetch(`/api/account/${accountEmail}`);
    account = await response.json();
}

async function fetchAccountBookings() {
    const response = await fetch(`/api/bookings?madeByAccount=${accountEmail}`);
    const data = await response.json();
    
    for (let booking of data) {
        accountBookings.push(booking);
    }
}

function populateProfileInfo() {
    document.querySelector("#fname").value = account.firstName;
    document.querySelector("#lname").value = account.lastName;
    document.querySelector("#e-mail").value = account.email;
    document.querySelector("#phone").value = account.phoneNumber;
    document.querySelector("#phone").setCustomValidity("");
    document.querySelector("#phone").classList.remove("is-invalid");
    document.querySelector("#phone").classList.remove("is-valid");
    iti.destroy();
    iti = initializeIti();
}

function populateModal(event) {
    const booking = accountBookings.find(booking => booking.id === event.currentTarget.id.split("-")[1]);
    bookingToEdit = booking;
    dates["check-in"] = new Date(booking.checkInDate);
    dates["check-out"] = new Date(booking.checkOutDate);
    originalDates["check-in"] = new Date(booking.checkInDate);
    originalDates["check-out"] = new Date(booking.checkOutDate);

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
        await fetch(`/api/cancelBooking/${bookingToEdit.id}`);
        location.reload();
    }
    else if (event.currentTarget.textContent === "Confirm change") {
        if (originalDates["check-in"].getTime() !== dates["check-in"].getTime() && originalDates["check-out"].getTime() !== dates["check-out"].getTime()) {
            await fetch(`/api/changeBookingDates/${bookingToEdit.id}/${dates["check-in"].toLocaleDateString().replaceAll('/','-')}/${dates["check-out"].toLocaleDateString().replaceAll('/','-')}`);
            location.reload();
        }
    }
}

async function handleSaveProfile() {
    const validationResult = validateProfileForm();
    if (validationResult) {
        const data = {
            "accountId": accountEmail,
            "firstName": document.querySelector("#fname").value,
            "lastName": document.querySelector("#lname").value,
            "email": document.querySelector("#e-mail").value,
            "phoneNumber": iti.getNumber()
        };
        const response = await fetch(`/api/changeAccount`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(data)
        });

        if (response.status === 200) {
            bootstrap.Modal.getInstance(document.querySelector("#profileModal")).hide();
            location.reload();
        }
    }
}

async function handleChangePassword() {
    const validationResult = validateChangePasswordForm();
    if (validationResult) {
        const data = {
            "accountId": accountEmail,
            "oldPassword": document.querySelector("#old_password").value,
            "newPassword": document.querySelector("#new_password").value
        };
        const response = await fetch(`/api/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify(data)
        });
        
        if (response.status === 401) {
            document.querySelector("#old_password").setCustomValidity("Old password is incorrect");
            document.querySelector("#old_password").classList.remove("is-valid");
            document.querySelector("#old_password").classList.add("is-invalid");
        }
        else if (response.status === 200) {
            bootstrap.Modal.getInstance(document.querySelector("#changePasswordModal")).hide();
            location.reload();
        }
    }
}

async function updateProfilePhoto() {
    const profilePhotoContainer = document.querySelector("#profilePhotoContainer");
    profilePhotoContainer.innerHTML = "";
    const img = document.createElement("img");
    img.classList.add("card-img-top", "mt-3", "profilePhotoImg");
    img.src = URL.createObjectURL(document.querySelector("#fileInputHidden").files[0]);
    profilePhotoContainer.appendChild(img);

    const readPhoto = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    const file = document.querySelector("#fileInputHidden").files[0];
    const imageData = file ? await readPhoto(file) : null;

    const data = {
        "accountId": accountEmail,
        "profilePicture": imageData
    }
    const response = await fetch(`/api/uploadProfilePicture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data)
    });
}

function validateEmail() {
    const email = document.querySelector("#e-mail");
    if (!emailRegex.test(email.value)) {
        email.setCustomValidity("E-mail is not valid");
        email.classList.remove("is-valid");
        email.classList.add("is-invalid");
        return false;
    }
    else {
        email.setCustomValidity("");
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
        return true;
    }
}

function validatePhone() {
    const phone = document.querySelector("#phone");
    if (iti.isValidNumber() && phoneRegex.test(phone.value)) {
        phone.setCustomValidity("");
        phone.parentElement.classList.remove("is-invalid");
        phone.parentElement.classList.add("is-valid");
        phone.classList.remove("is-invalid");
        phone.classList.add("is-valid");
        return true;
    } 
    else {
        phone.setCustomValidity("Phone is not valid");
        phone.parentElement.classList.remove("is-valid");
        phone.parentElement.classList.add("is-invalid");
        phone.classList.remove("is-valid");
        phone.classList.add("is-invalid");
        const errorCode = iti.getValidationError();

        document.querySelector("#phone_error_message").textContent = `${errorMap[errorCode]}`;
        return false;
    }
}

function validatePassword(passwordElement) {
    let lengthMatch = false;
    let numberMatch = false;
    let lowerCaseMatch = false;
    let upperCaseMatch = false;
    let specialCharacterMatch = false;

    if (lengthRegex.test(passwordElement.value)){    
        lengthMatch = true;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#lengthMatch`).classList.remove("x");
            document.querySelector(`#lengthMatch`).classList.add("check");
        }
    }
    else {
        lengthMatch = false;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#lengthMatch`).classList.remove("check");
            document.querySelector(`#lengthMatch`).classList.add("x");
        }
    }

    if (numberRegex.test(passwordElement.value)){    
        numberMatch = true;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#numberMatch`).classList.remove("x");
            document.querySelector(`#numberMatch`).classList.add("check");
        }
    }
    else {
        numberMatch = false;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#numberMatch`).classList.remove("check");
            document.querySelector(`#numberMatch`).classList.add("x");
        }
    }

    if (lowerCaseRegex.test(passwordElement.value)){    
        lowerCaseMatch = true;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#lowerCaseMatch`).classList.remove("x");
            document.querySelector(`#lowerCaseMatch`).classList.add("check");
        }
    }
    else {
        lowerCaseMatch = false;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#lowerCaseMatch`).classList.remove("check");
            document.querySelector(`#lowerCaseMatch`).classList.add("x");
        }
    }

    if (upperCaseRegex.test(passwordElement.value)){    
        upperCaseMatch = true;    
        if (passwordElement.id === "new_password") {
            document.querySelector(`#upperCaseMatch`).classList.remove("x");
            document.querySelector(`#upperCaseMatch`).classList.add("check");
        }
    }
    else {
        upperCaseMatch = false;    
        if (passwordElement.id === "new_password") {
            document.querySelector(`#upperCaseMatch`).classList.remove("check");
            document.querySelector(`#upperCaseMatch`).classList.add("x");
        }
    }

    if (specialCharacterRegex.test(passwordElement.value)){    
        specialCharacterMatch = true;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#specialCharacterMatch`).classList.remove("x");
            document.querySelector(`#specialCharacterMatch`).classList.add("check");
        }
    }
    else {
        specialCharacterMatch = false;
        if (passwordElement.id === "new_password") {
            document.querySelector(`#specialCharacterMatch`).classList.remove("check");
            document.querySelector(`#specialCharacterMatch`).classList.add("x");
        }
    }

    if (lengthMatch && numberMatch && lowerCaseMatch && upperCaseMatch && specialCharacterMatch) {
        passwordElement.setCustomValidity("");
        passwordElement.classList.remove("is-invalid");
        passwordElement.classList.add("is-valid");
        return true;
    }
    else {
        passwordElement.setCustomValidity("Password is invalid");
        passwordElement.classList.remove("is-valid");
        passwordElement.classList.add("is-invalid");
        return false;
    }
}

function validateRepeatPassword() {
    if (repeatPassword.value !== newPassword.value) {
        repeatPassword.setCustomValidity("The password is not the same");
        repeatPassword.classList.remove("is-valid");
        repeatPassword.classList.add("is-invalid");
        return false;
    }
    else {
        repeatPassword.setCustomValidity("");
        repeatPassword.classList.remove("is-invalid");
        repeatPassword.classList.add("is-valid");
        return true;
    }
}

function validateProfileForm() {
    const formValidity = document.querySelector("#profileForm").checkValidity();
    const validEmail = validateEmail();
    const validPhone = validatePhone();

    document.querySelector("#profileForm").classList.add('was-validated');

    if (formValidity && validEmail && validPhone) return true;
    else return false;
}

function validateChangePasswordForm() {
    const formValidity = document.querySelector("#changePasswordForm").checkValidity();
    const validOldPassword = validatePassword(oldPassword);
    const validNewPassword = validatePassword(newPassword);
    const validRepeat = validateRepeatPassword();

    document.querySelector("#changePasswordForm").classList.add('was-validated');

    if (formValidity && validOldPassword && validNewPassword && validRepeat) return true;
    else return false;
}

function initializeIti() {
    return window.intlTelInput(phone,{
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
        initialCountry: "gr",
        preferredCountries: ["gr"],
        // responsiveDropdown: true,
        separateDialCode: true,
        geoIpLookup: callback => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => callback(data.country_code))
          .catch(() => callback("us"));
        }
    });
}

function setPhoneDropdownSize() {
    PhoneDropdown.style.width = `${phoneContainer.offsetWidth}px`;
}