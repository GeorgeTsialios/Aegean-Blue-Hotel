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
        resetCustomValidity();
        if (!form.checkValidity() || !checkRepeatPasswordValidity() || !checkEmailValidity()) {
            if (!checkRepeatPasswordValidity()) {
                document.querySelector("#repeat_password").setCustomValidity("The password is not the same");
                document.querySelector("#repeat_password").classList.remove("is-valid");
                document.querySelector("#repeat_password").classList.add("is-invalid");
            }
            if (!checkEmailValidity()) {
                document.querySelector("#e-mail").setCustomValidity("E-mail is not valid");
                document.querySelector("#e-mail").classList.remove("is-valid");
                document.querySelector("#e-mail").classList.add("is-invalid");
            }
            event.preventDefault();
            event.stopPropagation();
        } 

        form.classList.add('was-validated');
    }, false);
}

function checkRepeatPasswordValidity() {
    if (document.querySelector("#repeat_password").required && document.querySelector("#repeat_password").value !== document.querySelector("#password").value)
        return false;

    return true;
}

function checkEmailValidity() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(document.querySelector("#e-mail").value))
        return false;

    return true;
}

function resetCustomValidity() {
    document.querySelector("#repeat_password").setCustomValidity("");
    document.querySelector("#repeat_password").classList.remove("is-invalid");
    document.querySelector("#e-mail").setCustomValidity("");
    document.querySelector("#e-mail").classList.remove("is-invalid");
}
