const registerButton = document.getElementById('register-button');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerPasswordConfirm = document.getElementById('register-password-confirm');
const registerError = document.getElementById('register-error');

registerButton.addEventListener('click', () => {
    const email = registerEmail.value;
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;

    if (password !== passwordConfirm) {
        registerError.innerHTML = "Passwords do not match.";
        return;
    }

    socket.emit('register', { email, password }, (data) => {
        if (data.success) {
            console.log("Registered successfully! ", data);
        } else {
            registerError.innerHTML = data.error;
        }
    });
});
