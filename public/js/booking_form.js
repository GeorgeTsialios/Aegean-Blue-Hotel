const phone = document.querySelector("#phone");
const phoneRegex = /^[0-9\(\)\-\s]+$/;
const email = document.querySelector("#e-mail");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const form = document.querySelector("form");
// const streetNumber = document.querySelector("#street_number");
// const postalCode = document.querySelector("#postal_code");
// const NumberRegex = /^[0-9]+$/;
const country = document.querySelector("#country");
const phoneContainer = document.querySelector("#phone_container");

let iti = null;

document.addEventListener("DOMContentLoaded", () => {
    email.addEventListener('blur',validateEmail);
    phone.addEventListener('blur',(event) => {
      validatePhone(event);
      phone.addEventListener('focus',validatePhone);
    });
    // streetNumber.addEventListener('blur',validateStreetNumber);
    country.addEventListener('focus',() => country.style.color="black");

    validate();
    iti = window.intlTelInput(phone,{
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
        initialCountry: "gr",
        preferredCountries: ["gr"],
        separateDialCode: true,
        geoIpLookup: callback => {
        fetch("https://ipapi.co/json")
          .then(res => res.json())
          .then(data => callback(data.country_code))
          .catch(() => callback("us"));
        }
    });

    setPhoneDropdownSize();
    window.addEventListener('resize',setPhoneDropdownSize);
})

const errorMap = {
    "-99": "Please provide a valid phone number",
    0:"Invalid number",
    1:"Invalid country code",
    2:"Too short",
    3:"Too long",
    4:"Invalid number"
};

function validate() {
  form.addEventListener('submit', (event) => {

    email.addEventListener("keyup",validateEmail);
    phone.addEventListener("keyup",validatePhone);
    // streetNumber.addEventListener("keyup",validateStreetNumber);

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    validateEmail(event);
    validatePhone(event);
    // validateStreetNumber(event);
  
    form.classList.add('was-validated');

    let invalidInputs = document.querySelectorAll(".is-invalid");
    if (invalidInputs.length === 0 && form.checkValidity())
        submitForm();

  }, false);
}

function validateEmail(event) {
    if (!emailRegex.test(email.value)) {
        email.setCustomValidity("E-mail is not valid");
        email.classList.remove("is-valid");
        email.classList.add("is-invalid");
        event.preventDefault();
        event.stopPropagation();
    }
    else {
        email.setCustomValidity("");
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
    }
}

function validatePhone(event) {
    console.log(iti.getNumber());
    if (iti.isValidNumber() && phoneRegex.test(phone.value)) {
        phone.setCustomValidity("");
        phone.parentElement.classList.remove("is-invalid");
        phone.parentElement.classList.add("is-valid");
        phone.classList.remove("is-invalid");
        phone.classList.add("is-valid");
    } 
    else {
        phone.setCustomValidity("Phone is not valid");
        phone.parentElement.classList.remove("is-valid");
        phone.parentElement.classList.add("is-invalid");
        phone.classList.remove("is-valid");
        phone.classList.add("is-invalid");
        const errorCode = iti.getValidationError();

        document.querySelector("#phone_error_message").textContent = `${errorMap[errorCode]}`;
        event.preventDefault();
        event.stopPropagation();
    }
}

// function validateStreetNumber(event) {
//     if (streetNumber.value === "")
//         streetNumber.classList.add("optional");
//     else {
//         streetNumber.classList.remove("optional");
//         if (!NumberRegex.test(streetNumber.value)) {
//             streetNumber.setCustomValidity("Street number is not valid");
//             streetNumber.classList.remove("is-valid");
//             streetNumber.classList.add("is-invalid");
//             event.preventDefault();
//             event.stopPropagation();
//         }
//         else {
//             streetNumber.setCustomValidity("");
//             streetNumber.classList.remove("is-invalid");
//             streetNumber.classList.add("is-valid");
//         }

//     }
// }

function submitForm() {
    console.log("Send form");
    phone.value = iti.getNumber();
}

function setPhoneDropdownSize() {
    const PhoneDropdown = document.querySelector("#iti-0__country-listbox");
    PhoneDropdown.style.width = `${phoneContainer.offsetWidth}px`;
}