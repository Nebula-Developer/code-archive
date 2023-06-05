const loginButton = document.getElementById('login-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        loginError.innerHTML = "Please fill out all fields.";
        return;
    }

    socket.emit('login', { email, password }, (data) => {
        if (data.success) {
            if (data.data.id) window.location.href = '/user/login/' + data.data.id;
        } else {
            loginError.innerHTML = data.error;
        }
    });
});

