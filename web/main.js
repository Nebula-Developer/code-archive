const socket = io("http://localhost:3000/", {
    transports: ["websocket"],
});

socket.on('message', (message) => {
    console.log(message)
    var msgElm = document.createElement("p");
    msgElm.innerText = `[${message.chat.name}] ${message.author.username}: ${message.content}`;
    $("#messages").prepend(msgElm);
});

$("#chat").hide();

$("#login-button").on("click", () => {
    var email = $("#login-email").val();
    var password = $("#login-password").val();

    socket.emit("loginPassword", email, password, (res) => {
        if (!res.success) return console.log("Error logging in:", res.error);

        localStorage.setItem("token", res.data.token);

        socket.emit("joinChat", 1, (res) => {
            $("#login").hide();
            $("#chat").show();
        });
    });
});

$("#register-button").on("click", () => {
    var username = $("#register-username").val();
    var email = $("#register-email").val();
    var password = $("#register-password").val();

    socket.emit("createUser", username, password, email, (res) => {
        if (!res.success) return console.log("Error registering:", res.error);

        localStorage.setItem("token", res.data.token);

        socket.emit("joinChat", 1, (res) => {
            $("#login").hide();
            $("#chat").show();
        });
    });
});

$("#chat-message").on("keydown", (e) => {
    if (e.keyCode == 13) {
        var message = $("#chat-message").val();
        socket.emit("createMessage", curChat, message, (res) => { });
        $("#chat-message").val("");
    }
});

socket.on("connect", () => {
    if (localStorage.getItem("token")) {
        socket.emit("loginToken", localStorage.getItem("token"), (res) => {
            if (!res.success) return console.log("Error logging in:", res.error);
            socket.emit("joinChat", 1, (res) => {
                $("#login").hide();
                $("#chat").show();
            });

        });
    }
});

var chats = $("#chats");
socket.emit("getChats", (res) => {
    if (!res.success) return console.log("Error getting chats:", res.error);

    for (var chat of res.data) {
        chats.append(`<option value="${chat.id}">${chat.name}</option>`);
    }
});

var curChat = 1;

function getCurMessages() {
    $("#messages").empty();

    socket.emit('getMessagesFrom', curChat, 0, 10, (res) => {
        if (!res.success) return console.log("Error getting messages:", res.error);
    
        for (var message of res.data) {
            var msgElm = document.createElement("p");
            msgElm.innerText = `[${message.chat.name}] ${message.author.username}: ${message.content}`;
            $("#messages").prepend(msgElm);
        }
    });
}

getCurMessages();

function joinChat(num) {
    console.log(num, curChat)
    socket.emit("leaveChat", curChat, (resA) => {     
        socket.emit("joinChat", num, (resB) => {
            console.log(resA,resB)
            curChat = parseInt(num);
            getCurMessages();
        });
    });
}

chats.on("change", () => {
    var chat = chats.val();
    joinChat(chat);
});

$("#new-chat-button").on("click", () => {
    var name = $("#new-chat-name").val();
    socket.emit("createChat", name, (res) => {
        if (!res.success) return console.log("Error creating chat:", res.error);

        chats.append(`<option value="${res.data.id}">${res.data.name}</option>`);
        chats.val(res.data.id);

        joinChat(res.data.id);
    });
});

socket.on("connect", () => {
    joinChat(curChat);
});
