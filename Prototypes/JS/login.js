const lengthRegex = /^.{8,32}$/;
let lengthMatch = false;
const numberRegex = /^.*[0-9]+.*$/;
let numberMatch = false; 
const lowerCaseRegex = /^.*[a-z]+.*$/;
let lowerCaseMatch = false; 
const upperCaseRegex = /^.*[A-Z]+.*$/;
let upperCaseMatch = false; 
const specialCharacterRegex = /^.*[*.!@$%^&(){}[\]:;<>,.?\/~_\+\-=|\\]+.*$/;
let specialCharacterMatch = false;
const password = document.querySelector("#password");
const repeatPassword = document.querySelector("#repeat_password");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const email = document.querySelector("#e-mail");
let state = "login";

document.addEventListener("DOMContentLoaded",() => {
    document.querySelector("#toRegister").addEventListener("click",changetoRegister);
    document.querySelector("#toLogin").addEventListener("click",changetoLogin);
    document.querySelector("#toPwdForgot").addEventListener("click",changetoPwdForgot);

    document.querySelectorAll("#passwordList>li").forEach((item) => item.classList.add("x"));

    email.addEventListener("blur",validateEmail);
    validate();
    password.addEventListener("keyup",(event) => {
        validatePassword(event);
        if (state === "register")
            validateRepeatPassword(event);
    });
})

function changetoRegister() {
    state = "register";
    document.querySelector(".invalid-feedback-register").classList.add("invalid-feedback");
    document.querySelector(".invalid-feedback-login").classList.remove("invalid-feedback");
    resetCustomValidity();
    document.querySelector("form").classList.remove("was-validated");
    document.querySelectorAll(".register-only").forEach((element) => element.style.display = "block");
    document.querySelectorAll(".register-only>input").forEach((element) => element.required = true);
    document.querySelectorAll(".login-only").forEach((element) => element.style.display = "none");

    document.querySelectorAll(".password").forEach((element) => element.style.display = "block");
    password.required = true;

    document.querySelector("#heading").textContent = "Create account";
    document.querySelector(".btn-dark").textContent = "Register";
}

function changetoLogin() {
    state = 'login';
    document.querySelector(".invalid-feedback-login").classList.add("invalid-feedback");
    document.querySelector(".invalid-feedback-register").classList.remove("invalid-feedback");
    resetCustomValidity();
    document.querySelector("form").classList.remove("was-validated");
    document.querySelectorAll(".login-only").forEach((element) => element.style.display = "block");
    document.querySelectorAll(".register-only").forEach((element) => element.style.display = "none");
    document.querySelectorAll(".register-only>input").forEach((element) => {
        element.required = false;
        element.value = "";
    });
    
    document.querySelectorAll(".password").forEach((element) => element.style.display = "block");
    password.required = true;

    document.querySelector("#heading").textContent = "Log into your account";
    document.querySelector(".btn-dark").textContent = "Login";
}

function changetoPwdForgot() {
    state = "pwdforgot";
    resetCustomValidity();
    document.querySelector("form").classList.remove("was-validated");
    document.querySelector("#toPwdForgot").style.display = "none";
    
    document.querySelectorAll(".password").forEach((element) => element.style.display = "none");
    password.required = false;
    password.value = "";

    document.querySelectorAll(".register-only").forEach((element) => element.style.display = "none");

    document.querySelector("#toLogin").style.display = "block";

    document.querySelectorAll(".register-only>input").forEach((element) => element.required = false);

    document.querySelector("#heading").textContent = "Restore your password";
    document.querySelector(".btn-dark").textContent = "Restore";
}

function validate(){
    form = document.querySelector("form");
    form.addEventListener('submit', (event) => {

        email.addEventListener("keyup",validateEmail);
        repeatPassword.addEventListener("keyup",validateRepeatPassword);

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        validateEmail(event);
        if (state === "login" || state === "register")
            validatePassword(event);
        if (state === "register")
            validateRepeatPassword(event);
        

        form.classList.add('was-validated');
    }, false);
}

function validatePassword(event) {

    if (lengthRegex.test(password.value)){    
        lengthMatch = true;
        document.querySelector("#lengthMatch").classList.remove("x");
        document.querySelector("#lengthMatch").classList.add("check");
    }
    else {
        lengthMatch = false;
        document.querySelector("#lengthMatch").classList.remove("check");
        document.querySelector("#lengthMatch").classList.add("x");
    }

    if (numberRegex.test(password.value)){    
        numberMatch = true;
        document.querySelector("#numberMatch").classList.remove("x");
        document.querySelector("#numberMatch").classList.add("check");
    }
    else {
        numberMatch = false;
        document.querySelector("#numberMatch").classList.remove("check");
        document.querySelector("#numberMatch").classList.add("x");
    }

    if (lowerCaseRegex.test(password.value)){    
        lowerCaseMatch = true;
        document.querySelector("#lowerCaseMatch").classList.remove("x");
        document.querySelector("#lowerCaseMatch").classList.add("check");
    }
    else {
        lowerCaseMatch = false;
        document.querySelector("#lowerCaseMatch").classList.remove("check");
        document.querySelector("#lowerCaseMatch").classList.add("x");
    }

    if (upperCaseRegex.test(password.value)){    
        upperCaseMatch = true;    
        document.querySelector("#upperCaseMatch").classList.remove("x");
        document.querySelector("#upperCaseMatch").classList.add("check");
    }
    else {
        upperCaseMatch = false;    
        document.querySelector("#upperCaseMatch").classList.remove("check");
        document.querySelector("#upperCaseMatch").classList.add("x");
    }

    if (specialCharacterRegex.test(password.value)){    
        specialCharacterMatch = true;
        document.querySelector("#specialCharacterMatch").classList.remove("x");
        document.querySelector("#specialCharacterMatch").classList.add("check");
    }
    else {
        specialCharacterMatch = false;
        document.querySelector("#specialCharacterMatch").classList.remove("check");
        document.querySelector("#specialCharacterMatch").classList.add("x");
    }

    if (lengthMatch && numberMatch && lowerCaseMatch && upperCaseMatch && specialCharacterMatch) {
        password.setCustomValidity("");
        password.classList.remove("is-invalid");
        password.classList.add("is-valid");
    }
    else {
        password.setCustomValidity("Password is invalid");
        password.classList.remove("is-valid");
        password.classList.add("is-invalid");
        event.preventDefault();
        event.stopPropagation();
    }
}

function validateRepeatPassword(event) {
    if (repeatPassword.required) {
        if (repeatPassword.value !== password.value) {
            repeatPassword.setCustomValidity("The password is not the same");
            repeatPassword.classList.remove("is-valid");
            repeatPassword.classList.add("is-invalid");
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            repeatPassword.setCustomValidity("");
            repeatPassword.classList.remove("is-invalid");
            repeatPassword.classList.add("is-valid");
        }
    }
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

function resetCustomValidity() {
    repeatPassword.setCustomValidity("");
    repeatPassword.classList.remove("is-invalid");
    email.setCustomValidity("");
    email.classList.remove("is-invalid");
    password.setCustomValidity("");
    password.classList.remove("is-invalid");
}
