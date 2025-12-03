let current = chrome || browser;

function sendBackgroundMessage(message, data) {
    current.runtime.sendMessage({
        message: message,
        data: data
    });
}

function requestBackgroundMessage(message, data, callback) {
    current.runtime.sendMessage({
        message: message,
        data: data
    }, callback);
}

function setVariable(name, value) {
    current.storage.local.set({
        [name]: value
    });
}

function getVariable(name) {
    return new Promise((resolve, reject) => {
        current.storage.local.get([name], function (result) {
            resolve(result[name]);
        });
    });
}

function addMessage(message) {
    var messageElement = $("<div class='skillnexus-message'></div>");
    var messageContent = $("<div class='skillnexus-message-content'></div>");
    var messageAuthor = $("<div class='skillnexus-message-author'></div>");

    messageAuthor.text(message.author.username);
    messageContent.text(message.content);

    messageElement.append(messageAuthor);
    messageElement.append(messageContent);

    $("#skillnexus-chat-messages").append(messageElement);
    $("#skillnexus-chat-messages").scrollTop($("#skillnexus-chat-messages")[0].scrollHeight);
}

function loadMessages(messages) {
    $("#skillnexus-chat-messages").empty();
    messages.forEach((message) => {
        addMessage(message);
    });
}

var eventListeners = {
    "setActiveChat": (request, sender, sendResponse) => {
        loadMessages(request.data);
    },
    "message": (request, sender, sendResponse) => {
        console.log("NEW MESSAGE:", request.data)
        addMessage(request.data);
    }
};

current.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var key in eventListeners) {
        if (request.message === key) {
            eventListeners[key](request, sender, sendResponse);
        }
    }
});

function appendHTMLFile(file) {
    return new Promise((resolve, reject) => {
        $.get(chrome.extension.getURL("/src/ui/html/" + file), function (data) {
            $(data).appendTo('body');
            resolve();
        });
    });
}

function login(user) {
    $("#skillnexus-login-panel").hide();
    $("#skillnexus-register-panel").hide();
    $("#skillnexus-chat-panel").show();

    if (user.token) setVariable("token", user.token);
}

getVariable("token").then((res) => {
    if (res) {
        requestBackgroundMessage("performSocketAction", {
            action: "loginToken",
            args: [
                res
            ]
        }, (res) => {
            if (res.success) login(res.data);
        });
    }
});

appendHTMLFile("index.html").then(() => {
    $(document).ready(function() {
        $('#skillnexus-chat-grabber').mousedown(function(e) {
            $('body').addClass('grabbing-skillnexus-chat');
            e.preventDefault();
            var offset = e.pageX - $('#skillnexus-chat-grabber').offset().left;
            $(document).mousemove(function(e) {
                var newWidth = window.innerWidth - e.pageX + offset;
                newWidth = Math.min(Math.max(250, newWidth), 600);
                $('body').css('--chat-width', newWidth + 'px');
                setVariable("chatWidth", newWidth);
            });
        });
    
        $('#skillnexus-toolbar-grabber').mousedown(function(e) {
            $('body').addClass('grabbing-skillnexus-toolbar');
            e.preventDefault();
            var offset = e.pageY - $('#skillnexus-toolbar-grabber').offset().top;
            $(document).mousemove(function(e) {
                var newHeight = window.innerHeight - e.pageY + offset;
                newHeight = Math.min(Math.max(100, newHeight), 600);
                $('body').css('--toolbar-height', newHeight + 'px');
                setVariable("toolbarHeight", newHeight);
            });
        });
    
        $(document).mouseup(function(e) {
            $(document).unbind('mousemove');
            $('body').removeClass('grabbing-skillnexus-chat');
            $('body').removeClass('grabbing-skillnexus-toolbar');
        });

        getVariable("chatWidth").then((res) => {
            if (!res) return;
            $('body').css('--chat-width', res + 'px');
        });

        getVariable("toolbarHeight").then((res) => {
            if (!res) return;
            $('body').css('--toolbar-height', res + 'px');
        });

        $("#skillnexus-input").on("keypress", function(e) {
            if (e.which == 13) {
                var val = $(this).val();
                $(this).val("");
                requestBackgroundMessage("performSocketAction", {
                    action: "createMessage",
                    args: [
                        "activeChat",
                        val
                    ]
                }, (res) => {
                    console.log("Res:", res);
                });
            }
        });

        $("#skillnexus-chat-panel").hide();

        $("#skillnexus-register-submit").on("click", () => {
            var username = $("#skillnexus-register-username").val();
            var email = $("#skillnexus-register-email").val();
            var password = $("#skillnexus-register-password").val();

            if (!username || !email || !password) return;

            requestBackgroundMessage("performSocketAction", {
                action: "createUser",
                args: [
                    username,
                    password,
                    email
                ]
            }, (res) => {
                if (res.success) login(res.data);
            });
        });

        $("#skillnexus-login-submit").on("click", () => {
            var email = $("#skillnexus-login-email").val();
            var password = $("#skillnexus-login-password").val();

            if (!email || !password) return;

            requestBackgroundMessage("performSocketAction", {
                action: "loginPassword",
                args: [
                    email,
                    password
                ]
            }, (res) => {
                if (res.success) login(res.data);
            });
        });

        $("#skillnexus-register-panel").hide();

        $("#skillnexus-register-login").on("click", () => {
            $("#skillnexus-register-panel").hide();
            $("#skillnexus-login-panel").show();
        });

        $("#skillnexus-login-register").on("click", () => {
            $("#skillnexus-login-panel").hide();
            $("#skillnexus-register-panel").show();
        });

        requestBackgroundMessage("getActiveMessages", {}, (res) => {
            if (!res.success) return;
            loadMessages(res.data);
        });
    });
});

// requestBackgroundMessage("performSocketAction", {
//     action: "createUser",
//     args: [
//         "testing",
//         "abcd",
//         "efghjjj@gmail.orgfsefqdqwds"
//     ]
// }, (res) => {
//     console.log("Res:", res);
// });

// requestBackgroundMessage("getActiveChat", {}, (res) => {
//     console.log("Chat Res:", res);
// });
