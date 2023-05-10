const phone = document.querySelector("#phone");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const email = document.querySelector("#e-mail");

const iti = window.intlTelInput(phone,{
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
    initialCountry: "auto",
    geoIpLookup: callback => {
    fetch("https://ipapi.co/json")
      .then(res => res.json())
      .then(data => callback(data.country_code))
      .catch(() => callback("us"));
  }
  });

document.addEventListener("DOMContentLoaded",() => {
    email.addEventListener("blur",validateEmail);
    phone.addEventListener('blur',(event) => {
      validatePhone(event);
      phone.addEventListener('focus',validatePhone);
    });

    // document.querySelector(".iti__country").addEventListener('click',validatePhone);
    validate();
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
  form = document.querySelector("form");
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
    
      if (iti.isValidNumber()) {
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