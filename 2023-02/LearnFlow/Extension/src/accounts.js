function loginHandler(res, callback, useSession = false, useStorage = true) {
    if (!res.success) {
        callback(res);
        return;
    }
    
    var account = res.data;
    if (account.token && useStorage) {
        chrome.storage.local.set({ token: account.token });
    }
    
    callback(res);
}

function login(username, password, callback, useSession = false) {
    socket.emit('login', { username: username, password: password }, (res) => {
        loginHandler(res, callback, useSession);
    });
}

function register(username, email, password, callback) {
    socket.emit('register', { username: username, email: email, password: password }, (res) => {
        callback(res);
    });
}

function loginToken(token, errorCallback) {
    console.log("Try token: " + token);
    socket.emit('login_token', { token: token }, (res) => {
        if (!res.success) {
            errorCallback(res.error);
            return;
        }
    });
}
