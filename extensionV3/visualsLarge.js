function dragToScrollHorizontal(jqueryElm) {
    var elm = jqueryElm[0];
    var isDragging = false;
    var lastX = 0;
    var lastScrollLeft = 0;

    jqueryElm.on('mousedown', function(e) {
        // Make sure we are not selecting a child
        if (e.target !== elm && !e.target.classList.contains('lp-msg-panel')) {
            return;
        }

        e.preventDefault();
        isDragging = true;
        lastX = e.clientX;
        lastScrollLeft = elm.scrollLeft;

        lockToolbar();
        
        $(document).on('selectstart', function() {
            return false;
        });

        function revert() {
            $(document).off('selectstart');
            $(document).off('mousemove');

            suggestUnlockToolbar();
            
            isDragging = false;
        }

        $(document).on('mouseup', revert);
        $(document).on('mouseleave', revert);

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                var deltaX = e.clientX - lastX;
                elm.scrollLeft = lastScrollLeft - deltaX;
            }
        });
    });
}

function dragToScrollVertical(jqueryElm) {
    var elm = jqueryElm[0];
    var isDragging = false;
    var lastY = 0;
    var lastScrollTop = 0;

    jqueryElm.on('mousedown', function(e) {
        // Make sure we are not selecting a child
        if (e.target !== elm && !e.target.classList.contains('lp-msg-panel')) {
            return;
        }

        e.preventDefault();
        isDragging = true;
        lastY = e.clientY;
        lastScrollTop = elm.scrollTop;

        var wasLocked = toolbarLocked;
        lockToolbar();
        
        $(document).on('selectstart', function() {
            return false;
        });

        function revert() {
            $(document).off('selectstart');
            $(document).off('mousemove');

            if (!wasLocked) {
                unlockToolbar();
            }
            
            isDragging = false;
        }

        $(document).on('mouseup', revert);
        $(document).on('mouseleave', revert);

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                var deltaY = e.clientY - lastY;
                elm.scrollTop = lastScrollTop - deltaY;
            }
        });
    });
}

function loadChannelBrowser() {
    getChannels((res) => {
        if (!res.success) return;
        var channels = res.data;
        var channelList = $("#channel-list");
        channelList.empty();
        channels.forEach((channel) => {
            var channelItem = document.createElement('div');
            channelItem.className = 'lp-channel-item';
            channelItem.innerHTML = channel.name;
            channelItem.onclick = () => {
                joinChannel(channel.id, (res) => {
                    if (res.success) {
                        showAlert("Joined channel!");
                        handleChannelJoin(channel, res.data);
                    } else {
                        showAlert(res.error);
                    }
                });
            }
            channelList.append(channelItem);
        });
    });
}

var channelPanels = {};

function handleChannelJoin(channel, messages) {
    var panel = $("<div class='lp-msg-panel' id='lp-channel-panel-" + channel.id + "'></div>");
    var panelHeader = $("<div class='lp-channel-panel-header'></div>");
    var panelHeaderTitle = $("<div class='lp-channel-panel-header-title'>" + channel.name + "</div>");
    var panelHeaderClose = $("<div class='lp-channel-panel-header-close'><i class='fas fa-times'></i></div>");
    panelHeaderClose.click(() => {
        leaveChannel(channel.id, (res) => {
            if (res.success) {
                showAlert("Left channel!");
                handleChannelLeave(channel);
            } else {
                showAlert(res.error);
            }
        });
    });
    panelHeader.append(panelHeaderTitle);
    panelHeader.append(panelHeaderClose);
    panel.append(panelHeader);
    var panelBody = $("<div class='lp-channel-panel-body'></div>");

    messages.forEach((msg) => {
        var msgElm = $("<div class='lp-channel-panel-msg'></div>");
        var msgElmHeader = $("<div class='lp-channel-panel-msg-header'></div>");
        var msgElmHeaderName = $("<div class='lp-channel-panel-msg-header-name'>" + msg.username + "</div>");
        var msgElmHeaderTime = $("<div class='lp-channel-panel-msg-header-time'>" + new Date(msg.timestamp).toLocaleString() + "</div>");
        msgElmHeader.append(msgElmHeaderName);
        msgElmHeader.append(msgElmHeaderTime);
        var msgElmBody = $("<div class='lp-channel-panel-msg-body'>" + msg.message + "</div>");
        msgElm.append(msgElmHeader);
        msgElm.append(msgElmBody);
        panelBody.append(msgElm);
        panelBody.scrollTop(panelBody[0].scrollHeight);
    });

    panel.append(panelBody);

    var panelInput = $("<div class='lp-channel-panel-input'></div>");
    var panelInputInput = $("<input class='lp-channel-panel-input-input learnplus-input-small lp-no-btn-margin' type='text' placeholder='Message...'></input>");
    var panelInputSend = $("<div class='lp-channel-panel-input-send'>Send</div>");

    panelInputInput.keypress((e) => {
        if (e.which == 13) {
            panelInputSend.click();
        }
    });

    panelInputSend.click(() => {
        var msg = panelInputInput.val();
        if (msg.length > 0) {
            sendMessage(channel.id, msg, (res) => {
                console.log(res);
                if (res.success) {
                    panelInputInput.val("");
                } else {
                    showAlert(res.error);
                }
            });
        }
    });

    panelInput.append(panelInputInput);
    panelInput.append(panelInputSend);
    panel.append(panelInput);

    $("#learnplus-msgpanel-wrapper").append(panel);
    channelPanels[channel.id] = panel;
    dragToScrollVertical(panelBody);

    addChannelListener(channel.id, (msg) => {
        var msgElm = $("<div class='lp-channel-panel-msg'></div>");
        var msgElmHeader = $("<div class='lp-channel-panel-msg-header'></div>");
        var msgElmHeaderName = $("<div class='lp-channel-panel-msg-header-name'>" + msg.username + "</div>");
        var msgElmHeaderTime = $("<div class='lp-channel-panel-msg-header-time'>" + new Date(msg.timestamp).toLocaleString() + "</div>");
        msgElmHeader.append(msgElmHeaderName);
        msgElmHeader.append(msgElmHeaderTime);
        var msgElmBody = $("<div class='lp-channel-panel-msg-body'>" + msg.message + "</div>");
        msgElm.append(msgElmHeader);
        msgElm.append(msgElmBody);
        panelBody.append(msgElm);
        panelBody.scrollTop(panelBody[0].scrollHeight);
    });
}

function handleChannelLeave(channel) {
    channelPanels[channel.id].remove();
    removeChannelListeners(channel.id);
    delete channelPanels[channel.id];
}
