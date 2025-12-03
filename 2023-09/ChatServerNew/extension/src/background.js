let current = chrome || browser;
let socket = io('http://localhost:3000');

var activeChat = 1;

current.storage.local.get('activeChat', (result) => {
    if (result.activeChat && result.activeChat.id) {
        activeChat = result.activeChat.id;
    }

    setActiveChat(activeChat);
});

function setActiveChat(chat) {
    socket.emit("joinChat", chat, async (res) => {
        if (res.success) {
            if (chat !== activeChat) {
                await new Promise((resolve, reject) => {
                    socket.emit("leaveChat", activeChat, (leaveRes) => {
                        resolve();
                    });
                });
            }
            
            activeChat = chat;
            current.storage.local.set({
                activeChat: res.data
            });

            socket.emit("getMessages", activeChat, (res) => {
                sendGlobalMessage("setActiveChat", res);
            }); 
        } else {
            console.log("Failed to join chat:", chat);
        }
    });
}

socket.on('connect', () => {
    console.log("Connected to server");
    setActiveChat(activeChat);
});

socket.on('message', (msg) => {
    console.log("inc message:", msg)
    sendGlobalMessage("message", msg);
});

function sendGlobalMessage(message, data) {
    current.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            current.tabs.sendMessage(tab.id, {
                message: message,
                data: data
            });
        });
    });
}

var eventListeners = {
    "getActiveMessages": (request, sender, sendResponse) => {
        sendResponse(new Promise((resolve, reject) => {
            if (request.data && request.data.start && request.data.limit) {
                socket.emit("getMessagesFrom", activeChat, request.data.start, request.data.limit, (res) => {
                    resolve(res);
                });
            } else {
                socket.emit("getMessages", activeChat, (res) => {
                    resolve(res);
                });
            }
        }));
    },
    "getActiveChat": (request, sender, sendResponse) => {
        sendResponse(new Promise((resolve, reject) => {
            socket.emit("getChat", activeChat, (res) => {
                resolve(res);
            });
        }));
    },
    "performSocketAction": (request, sender, sendResponse) => {
        sendResponse(new Promise((resolve, reject) => {    
            if (request.data && request.data.action) {
                if (request.data.args) {
                    for (var i = 0; i < request.data.args.length; i++) {
                        if (request.data.args[i] === "activeChat") {
                            request.data.args[i] = activeChat;
                        }
                    }
                }
                
                socket.emit(request.data.action, ...request.data.args, (res) => {
                    resolve(res);
                });
            }
        }));
    }
};

current.runtime.onMessage.addListener((request, sender, sendResponse) => {
    for (var key in eventListeners) {
        if (request.message === key) {
            eventListeners[key](request, sender, sendResponse);
        }
    }
});

sendGlobalMessage("hello", "world");
