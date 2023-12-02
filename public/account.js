var sessionUser = { };

const socket = io();
socket.emit("place", {
    x: 0, y: 0, color: "red"
}, (res) => {
    console.log("Place res", res);
});

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
                updateUserFrontend("my", data);
                resolve(data);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
};

fetchUser();

function distanceString(date) {
    if (!date) {
        return "Invalid date";
    }

    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const diffSeconds = diff / 1000;
    const diffMinutes = diffSeconds / 60;
    const diffHours = diffMinutes / 60;
    const diffDays = diffHours / 24;

    const formatTime = (value, unit) => {
        const roundedValue = Math.floor(value);
        return roundedValue + " " + unit + (roundedValue === 1 ? "" : "s") + " ago";
    };

    if (diffSeconds < 60) {
        return formatTime(diffSeconds, "second");
    } else if (diffMinutes < 60) {
        return formatTime(diffMinutes, "minute");
    } else if (diffHours < 24) {
        return formatTime(diffHours, "hour");
    } else if (diffDays < 7) {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[then.getDay()] + ", " + then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return then.toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }) + ", " + then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function updateUserFrontend(id, user) {
    for (let key in user) {
        if (key === 'avatar')
            $("." + id + "-user-avatar").attr("src", user.avatar);

        else if (key === 'createdAt' || key === 'updatedAt')
            $("." + id + "-user-" + key).html(distanceString(user[key]));

        else
            $("." + id + "-user-" + key).html(user[key]);

            $("." + id + "-user-" + key + "-input").val(user[key]);
    }
}

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
                        for (let key in sessionUser)
                            sessionUser[key] = null;
                    else
                        sessionUser = data;
                    
                    updateUserFrontend("my", sessionUser);
                }

                resolve(data);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}