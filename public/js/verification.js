const inputs = document.querySelectorAll('.otp-input');

for (let i = 0; i < inputs.length; i++) {
    if (i !== inputs.length - 1) {
        inputs[i].addEventListener('input', () => inputs[i+1].focus());
    }
}

inputs[0].focus();

document.querySelector('form').addEventListener('submit', (event) => {
    document.querySelector('#otp').value = `${inputs[0].value}${inputs[1].value}${inputs[2].value}${inputs[3].value}${inputs[4].value}${inputs[5].value}`;
});