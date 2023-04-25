document.addEventListener("DOMContentLoaded",() => {
    document.querySelector("#toRegister").addEventListener("click",changetoRegister);
    document.querySelector("#toLogin").addEventListener("click",changetoLogin);
    document.querySelector("#toPwdForgot").addEventListener("click",changetoPwdForgot);
    validate();
})

function changetoRegister() {
    resetCustomValidity();
    document.querySelector("form").classList.remove("was-validated");
    document.querySelectorAll(".register-only").forEach((element) => element.style.display = "block");
    document.querySelectorAll(".register-only>input").forEach((element) => element.required = true);
    document.querySelectorAll(".login-only").forEach((element) => element.style.display = "none");

    document.querySelectorAll(".password").forEach((element) => element.style.display = "block");
    document.querySelector("#password").required = true;

    document.querySelector("#heading").textContent = "Create account";
    document.querySelector(".btn-dark").textContent = "Register";
}

function changetoLogin() {
    resetCustomValidity();
    document.querySelector("form").classList.remove("was-validated");
    document.querySelectorAll(".login-only").forEach((element) => element.style.display = "block");
    document.querySelectorAll(".register-only").forEach((element) => element.style.display = "none");
    document.querySelectorAll(".register-only>input").forEach((element) => {
        element.required = false;
        element.value = "";
    });
    
    document.querySelectorAll(".password").forEach((element) => element.style.display = "block");
    document.querySelector("#password").required = true;

    document.querySelector("#heading").textContent = "Log into your account";
    document.querySelector(".btn-dark").textContent = "Login";
}

function changetoPwdForgot() {
    resetCustomValidity();
    document.querySelector("form").classList.remove("was-validated");
    document.querySelector("#toPwdForgot").style.display = "none";
    
    document.querySelectorAll(".password").forEach((element) => element.style.display = "none");
    document.querySelector("#password").required = false;
    document.querySelector("#password").value = "";

    document.querySelectorAll(".register-only").forEach((element) => element.style.display = "none");

    document.querySelector("#toLogin").style.display = "block";

    document.querySelectorAll(".register-only>input").forEach((element) => element.required = false);

    document.querySelector("#heading").textContent = "Restore your password";
    document.querySelector(".btn-dark").textContent = "Restore";
}

function validate(){
    form = document.querySelector("form");
    form.addEventListener('submit', (event) => {

        document.querySelector("#e-mail").addEventListener("keyup",validateEmail);
        document.querySelector("#repeat_password").addEventListener("keyup",validateRepeatPassword);

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        validateRepeatPassword(event);
        validateEmail(event);
        

        form.classList.add('was-validated');
    }, false);
}

function validateRepeatPassword(event) {
    if (document.querySelector("#repeat_password").required) {
        if (document.querySelector("#repeat_password").value !== document.querySelector("#password").value) {
            document.querySelector("#repeat_password").setCustomValidity("The password is not the same");
            document.querySelector("#repeat_password").classList.remove("is-valid");
            document.querySelector("#repeat_password").classList.add("is-invalid");
            event.preventDefault();
            event.stopPropagation();
        }
        else {
            document.querySelector("#repeat_password").setCustomValidity("");
            document.querySelector("#repeat_password").classList.remove("is-invalid");
            document.querySelector("#repeat_password").classList.add("is-valid");
        }
    }
}

function validateEmail(event) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = document.querySelector("#e-mail");

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
    document.querySelector("#repeat_password").setCustomValidity("");
    document.querySelector("#repeat_password").classList.remove("is-invalid");
    document.querySelector("#e-mail").setCustomValidity("");
    document.querySelector("#e-mail").classList.remove("is-invalid");
}
