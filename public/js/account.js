var sessionUser = { };

const login = (email, password) => sendUserRequest('/api/login', { email, password });
const register = (username, email, password) => sendUserRequest('/api/register', { username, email, password });
const logout = () => sendUserRequest('/api/logout', {}, true);
const update = (username, email, password, bio, avatar) => sendUserRequest('/api/update', { username, email, password, bio, avatar });
const fetchUser = () => {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:8080/api/user')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                reject(data.error);
            } else {
                sessionUser = data;
                resolve(data);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
};

function sendUserRequest(url, values, updateSessionUser = true) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8080${url}`, {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                reject(data.error);
            } else {
                if (updateSessionUser) {
                    if (!data.id)
                        sessionUser = { };
                    else
                        sessionUser = data;
                }

                resolve(data);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}