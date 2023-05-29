const phone = document.querySelector("#phone");
const phoneRegex = /^[0-9\(\)\-\s]+$/;
const email = document.querySelector("#e-mail");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const form = document.querySelector("form");
const country = document.querySelector("#country");
const phoneContainer = document.querySelector("#phone_container");

let iti = null;

document.addEventListener("DOMContentLoaded", () => {

    updateTotal();
    email.addEventListener('blur',validateEmail);
    phone.addEventListener('blur',(event) => {
        validatePhone(event);
        phone.addEventListener('focus',validatePhone);
    });
   
    country.addEventListener('focus',() => country.style.color="black");

    validate();
    iti = window.intlTelInput(phone,{
        utilsScript: "/js/utils.js",
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

function updateTotal() {
    TotalPrice = 0;
    TotalPriceWithDiscount = 0;
    Discount = 0;
    let totalCapacity = 0;

    roomTypesForBooking.forEach((roomType) => TotalPrice += (numberOfNights * Number(roomType.count) * Number(roomType.price) * (freeCancellationSelected?freeCancellationCoefficient:1)));
        TotalPrice += breakfastSelected?(numberOfGuests * numberOfNights * breakfastPriceperNightperPerson):0;
            Discount = TotalPrice * (account? account.accountLevel.discount: 0);
            TotalPriceWithDiscount = TotalPrice - Discount;
            if (!Number.isInteger(TotalPrice))
                TotalPrice = TotalPrice.toFixed(2);
            if (!Number.isInteger(Discount))
                Discount = Discount.toFixed(2);
            if (!Number.isInteger(TotalPriceWithDiscount)) 
                TotalPriceWithDiscount = TotalPriceWithDiscount.toFixed(2);

            document.querySelector("#originalPrice").innerHTML = `${TotalPrice}&euro;`;
            document.querySelector("#discount").innerHTML = `-${Discount}&euro;`;
            document.querySelector("#totalPrice").innerHTML = `${TotalPriceWithDiscount}&euro;`;
            document.querySelector("#totalPriceForm").value = TotalPriceWithDiscount;
} 

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

    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }

    validateEmail(event);
    validatePhone(event);
  
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

function submitForm() {
    phone.value = iti.getNumber();
}

function setPhoneDropdownSize() {
    const PhoneDropdown = document.querySelector("#iti-0__country-listbox");
    PhoneDropdown.style.width = `${phoneContainer.offsetWidth}px`;
}