
function createChannel(name, join = false) {
    socket.emit('createChannel', {
        name: name
    }, (res) => {
        if (res.success) {
            showAlert("Channel created!");
            console.log(res);
            joinChannel(res.data.id);
        } else {
            showAlert(res.error);
        }
    });
}

function sendMessage(channel, message, callback) {
    socket.emit('sendMessage', {
        channel: channel,
        message: message
    }, (res) => {
        callback(res);
    });
}

var channelListeners = {}
function addChannelListener(channel, callback) {
    channelListeners[channel] = callback;
}

function removeChannelListeners(channel) {
    delete channelListeners[channel];
}

function joinChannel(channel, callback = null) {
    socket.emit('joinChannel', {
        channel: channel
    }, (res) => {
        callback(res);
    });
}

function leaveChannel(channel, callback = null) {
    socket.emit('leaveChannel', {
        channel: channel
    }, (res) => {
        callback(res);
    });
}

function getChannels(callback) {
    socket.emit('getChannels', {}, (res) => {
        callback(res);
    });
}

socket.on('message', (data) => {
    if (channelListeners[data.channel]) {
        channelListeners[data.channel](data);
    }
});
