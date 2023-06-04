const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    socket.emit('login', { email, password }, (data) => {
        if (data.success) {
            console.log("Logged in successfully! ", data);
        } else {
            loginError.innerHTML = data.error;
        }
    });
});

