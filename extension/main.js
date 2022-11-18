// This is a manifest v3 extension.
// Lets try and get overlay.html with the chrome extension api.
var overlayPath = chrome.runtime.getURL("overlay.html");
var socket = io('http://localhost:3000');
var accUser = null;

var lastMessageUser = null;


setTimeout(() => {
    console.log(socket)
}, 1000);

var xhr = new XMLHttpRequest();
xhr.open("GET", overlayPath, true);
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        initOverlay(xhr.responseText);
    }
}
xhr.send();

function login(acc) {
    if (acc.token) {
        // Save in chrome storage
        chrome.storage.sync.set({ token: acc.token }, function() {
            console.log('Token saved');
        });
    }

    accUser = acc;

    $(".messenger-login").addClass("messenger-inactive");
    $(".messenger-register").addClass("messenger-inactive");
    $(".messenger-content").removeClass("messenger-inactive");
    requestMessages();
    scrollToMsgBottom();
}

function loginRes(res) {
    if (!res.success) {
        alert(res.error);
        return;
    }

    login(res.account);
}

function registerRes(res) {
    if (!res.success) {
        alert(res.error);
        return;
    }

    login(res.account);
}

socket.on('login', function(acc) {
    login(acc);
});

// See if we have a token saved
chrome.storage.sync.get(['token'], function(result) {
    if (result.token) {
        socket.emit('trylogin', result.token);
    }
});

function initOverlay(overlay) {
    var div = document.createElement("div");
    div.id = "msg-overlay";
    div.innerHTML = overlay;
    div.className = "overlay-active";
    document.body.appendChild(div);

    $(".messenger-login-swap-button").click(function() {
        $(".messenger-login").toggleClass("messenger-inactive");
        $(".messenger-register").toggleClass("messenger-inactive");
    });

    $("#messenger-login-submit").click(function() {
        var email = $("#messenger-login-email").val();
        var password = $("#messenger-login-password").val();
        socket.emit("login", { email: email, password: password }, loginRes);
    });

    $("#messenger-register-submit").click(function() {
        var username = $("#messenger-register-username").val();
        var email = $("#messenger-register-email").val();
        var password = $("#messenger-register-password").val();
        var password_confirm = $("#messenger-register-password-confirm").val();

        if (password != password_confirm) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 4) {
            alert("Password must be at least 4 characters");
            return;
        }

        if (username.length < 2 || username.length > 16) {
            alert("Username must be between 2 and 16 characters");
            return;
        }

        if (!validateEmail(email)) {
            alert("Invalid email");
            return;
        }

        socket.emit("register", { username: username, password: password, email: email }, registerRes);
    });

    $("#messenger-input").keydown(function(e) {
        var timerStart = new Date().getTime();
        if (e.which == 13) {
            if (accUser == null) {
                $(".messenger-login").removeClass("messenger-inactive");
                $(".messenger-register").addClass("messenger-inactive");
                $("#messenger-login-email").trigger("focus");
                return;
            }

            var msg = $("#messenger-input").val();
            if (msg.length == 0) return;
            $("#messenger-input").val("");

            if (msg == "logout") {
                chrome.storage.sync.remove('token', function() {
                    console.log('Token removed');
                    accUser = null;
                    $(".messenger-login").removeClass("messenger-inactive");
                    $(".messenger-register").addClass("messenger-inactive");
                    $(".messenger-content").addClass("messenger-inactive");
                });
                return;
            }

            socket.emit("message", {
                text: msg,
                token: accUser.token
            });
        }
    });

    $(".expand-button").click(function() {
        $("#msg-overlay").toggleClass("overlay-panel-expanded");
    });
}

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

document.addEventListener('keydown', function(event) {
    if (event.key == "b" && event.ctrlKey) {
        $("#msg-overlay").toggleClass("overlay-active");
    }
});

function requestMessages() {
    socket.emit('requestMessages');
}

socket.on('messages', (messages) => {
    if (messages == null || messages.length == 0) return;

    var doesNeedRefresh = ($("#messenger-messages").children().length + 1) != messages.length;

    $("#messenger-messages").empty();
    messages.forEach(a => appendMessage(a));
});

socket.on('message', (message) => {
    appendMessage(message);
});

function validateMessage(message) {
    if (!message || !message.username || !message.text) return false;
    if (!!message.reply && (!message.reply.username || !message.reply.text)) return false;
    return true;
}

var first = false;

async function appendMessage(message) {
    if (!validateMessage(message)) {
        console.log("Invalid message:", message);
        return;
    }

    var isReply = message.reply != undefined;
    var content = "";

    // 123456 -> Today at 12:34:56
    // If another day:
    // 123456 -> 12/34/56
    var timeStr = "";

    // Check if it is today
    var date = new Date(message.date); // 123456
    var today = new Date();

    if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
        timeStr = "Today at ";
        // 22:37:12 -> 10:37 PM
        timeStr += date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else {
        timeStr = date.toLocaleDateString();
    }

    if (isReply) {
        content = `
        <div msg-id="${message.id}" class="messenger-message messenger-replying-msg ${accUser && message.reply.username == accUser.username && message.username != accUser.username ? "ping" : ""}">
            <div class="messenger-profile-wrapper">
                <div class="messenger-reply-glyph"></div>
                <img src="http://localhost:3000/profile.jpg" alt="profile image" class="messenger-profile-img">
            </div>

            <div class="messenger-message-content">
                <div class="messenger-message-reply" msg-reply-id="${message.reply.id}">${message.reply.username}: ${message.reply.text}</div>
                <div class="messenger-message-username" ${message.color ? "style='color:" + message.color + "'" : ""}>${message.username}</div>

                <div class="messenger-message-text">
                    ${message.text}
                    <span class="messenger-message-timestamp">${timeStr}</span>
                </div>
            </div>

            <div class='reply-button-wrapper'>
                <div class="reply-button">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="reply" role="img" viewBox="0 0 512 512" class="svg-inline--fa fa-reply fa-w-16 fa-7x"><path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z" class=""/></svg>
                </div>
            </div>
        </div>
        `;
    } else {
        content = `
        <div class="messenger-message" msg-id="${message.id}">
            <div class="messenger-profile-wrapper">
                <img src="http://localhost:3000/profile.jpg" alt="Profile Image" class="messenger-profile-img">
            </div>

            <div class="messenger-message-content">
                <div class="messenger-message-username" ${message.color ? "style='color:" + message.color + "'" : ""}>${message.username}</div>
                <div class="messenger-message-text">
                    ${message.text}
                    <span class="messenger-message-timestamp">${timeStr}</span>
                </div>
            </div>
            
            <div class='reply-button-wrapper'>
                <div class="reply-button">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="reply" role="img" viewBox="0 0 512 512" class="svg-inline--fa fa-reply fa-w-16 fa-7x"><path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z" class=""/></svg>
                </div>
            </div>
        </div>
        `;
    }

    // Is at bottom of messenger-messages wrapper div:
    var wrapper = $("#messenger-messages-wrapper");
    var isAtBottom = wrapper.scrollTop() + wrapper.innerHeight() >= wrapper[0].scrollHeight;

    $("#messenger-messages").append(content);

    lastMessageUser = message.username;

    $(".reply-button").off("click").on("click", function() {
        var msgId = $(this).parent().parent().attr("msg-id");

        var msg = $("#messenger-input").val();
        if (msg.length == 0) return;
        $("#messenger-input").val("");

        socket.emit("message", {
            text: msg,
            token: accUser.token,
            reply: msgId
        });
    });

    $(".messenger-message-reply").off("click").on("click", function() {
        // Scroll to the message
        var msgId = $(this).attr("msg-reply-id");
        var msg = document.querySelector(`[msg-id="${msgId}"]`);
        msg.scrollIntoView({ behavior: "smooth" });
    });

    // Scroll to bottom
    if (isAtBottom)
        scrollToMsgBottom();
}

function scrollToMsgBottom() {
    $(".mesenger-messages-wrapper").scrollTop($(".mesenger-messages-wrapper")[0].scrollHeight);
}

jQuery.fn.scrollTo = function(elem, speed) { 
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top 
    }, speed == undefined ? 1000 : speed); 
    return this; 
};