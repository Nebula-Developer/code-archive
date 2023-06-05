const registerButton = document.getElementById('register-button');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerPasswordConfirm = document.getElementById('register-confirm-password');
const registerError = document.getElementById('register-error');

registerButton.addEventListener('click', () => {
    const email = registerEmail.value;
    const password = registerPassword.value;
    const passwordConfirm = registerPasswordConfirm.value;

    if (!email || !password || !passwordConfirm) {
        registerError.innerHTML = "Please fill out all fields.";
        return;
    }

    if (password !== passwordConfirm) {
        registerError.innerHTML = "Passwords do not match.";
        return;
    }

    socket.emit('register', { email, password }, (data) => {
        if (data.success) {
            if (data.data.id) window.location.href = '/user/login/' + data.data.id;
        } else {
            registerError.innerHTML = data.error;
        }
    });
});
