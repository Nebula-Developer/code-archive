showWelcome();

var globalServer = 'https://webpitch.net/';
var socket = io(globalServer);
var toggleLoginRegister = false;

socket.on('connect', () => {
    logMsg('Connected to LearnPlus server.');
});

socket.on('message', (msg) => {
    logMsg(msg);
});

function logMsg(msg) {
    console.log('%c[ LearnPlus ]%c ' + msg, 'color: #572680; font-family: courier;', 'color: #313444; font-family: courier;');
}

function alertMsg(title, content, fade = true) {
    var alertWrapper = $("#learnplus-alerts-wrapper");
    var alert = $('<div class="learnplus-alert" style="transform: translateX(130%);"></div>');
    var alertTitle = $('<div class="learnplus-alert-title"></div>');
    var alertContent = $('<div class="learnplus-alert-content"></div>');
    alertTitle.text(title);
    alertContent.html(content);
    alert.append(alertTitle);
    alert.append(alertContent);
    alertWrapper.append(alert);
    
    setTimeout(() => {
        alert.css('transform', 'translateX(0)');
    }, 100);

    if (fade) {
        setTimeout(() => {
            alert.fadeOut(300, () => {
                alert.remove();
            });
        }, 3000);
    } else {
        return function() {
            alert.fadeOut(300, () => {
                alert.remove();
            });
        }
    }
}

function getFile(name, callback) {
    socket.emit('getFile', name, (data) => {
        callback(data);
    });
}

getFile("overlay.html", (overlay) => {
    if (!overlay.success) {
        alertMsg('LearnPlus Error', 'Failed to load overlay.');
        return;
    }

    getFile("overlay.css", (overlayCSS) => {
        if (!overlayCSS.success) {
            alertMsg('LearnPlus Error', 'Failed to load overlay CSS.');
            return;
        }

        $('body').append(overlay.data);
        $('head').append('<style>' + overlayCSS.data + '</style>');

        $('#learnplus-login-button').on('click', () => {
            var username = $('#learnplus-login-username').val();
            var password = $('#learnplus-login-password').val();

            socket.emit('login', {
                username: username,
                password: password
            }, (data) => {
                if (data.success) {
                    alertMsg('Account', 'Logged in as ' + data.data.username + '.');
                    var token = data.data.token;
                    chrome.storage.local.set({'learnplus-token': token}, () => {
                        logMsg('Saved token to local storage.');
                    });
                    hideLoginRegister();
                } else {
                    alertMsg('Account', 'Failed to login: ' + data.error);
                }
            });
        });

        $('#learnplus-register-button').on('click', () => {
            var username = $('#learnplus-register-username').val();
            var password = $('#learnplus-register-password').val();
            var passwordConfirm = $('#learnplus-register-password-confirm').val();
            var email = $('#learnplus-register-email').val();

            if (password != passwordConfirm) {
                alertMsg('Passwords do not match.');
                return;
            }

            socket.emit('register', {
                username: username,
                password: password,
                email: email
            }, (data) => {
                if (data.success) {
                    alertMsg('Account', 'Registered as ' + data.data.username + '.');
                    var token = data.data.token;
                    chrome.storage.local.set({'learnplus-token': token}, () => {
                        logMsg('Saved token to local storage.');
                    });
                    hideLoginRegister();
                } else {
                    alertMsg('Account', 'Failed to register: ' + data.error);
                }
            });
        });

        
        $(".learnplus-toggle-login-register").on('click', () => {
            if (toggleLoginRegister) {
                $('#learnplus-login-panel').removeClass('learnplus-hidden');
                $('#learnplus-register-panel').addClass('learnplus-hidden');
            } else {
                $('#learnplus-login-panel').addClass('learnplus-hidden');
                $('#learnplus-register-panel').removeClass('learnplus-hidden');
            }
            toggleLoginRegister = !toggleLoginRegister;
        });

        $(".learnplus-close-login-register").on('click', () => {
            hideLoginRegister();
        });

        $(".learnplus-hide-parent").on('click', (e) => { $(e.target).parent().fadeOut(300); });
        $(".learnplus-hide-create-room").on('click', () => {
            $("#learnplus-create-room-panel").fadeOut(300);
            $(".learnplus-hide-create-room").addClass('learnplus-no-pointer');
            setTimeout(() => { $(".learnplus-hide-create-room").removeClass('learnplus-no-pointer'); }, 300);
            alertMsg('Room', 'Room creation cancelled.');
        });

        checkLocalToken();
    });
});

function hideLoginRegister() {
    $("#learnplus-login-panel").addClass('learnplus-hidden');
    $("#learnplus-register-panel").addClass('learnplus-hidden');
    toggleLoginRegister = false;
}

function showLoginRegister() {
    $("#learnplus-login-panel").removeClass('learnplus-hidden');
    $("#learnplus-register-panel").addClass('learnplus-hidden');
    toggleLoginRegister = false;
}

function checkLocalToken() {
    chrome.storage.local.get(['learnplus-token'], (result) => {
        if (result['learnplus-token']) {
            socket.emit('loginToken', result['learnplus-token'], (data) => {
                if (!data.success) {
                    chrome.storage.local.remove(['learnplus-token'], () => { });
                    chrome.storage.local.remove(['learnplus-signin-dismissed'], () => { });
                    alertMsg('Account', 'Failed to login: ' + data.error);
                    showLoginAlert();
                }
            });
        } else showLoginAlert();
    });
}

function showLoginAlert() {
    var learnplusSigninAlert = alertMsg('You are not logged in to LearnPlus', `
    <div class="learnplus-alert-text-mb">Would you like to sign in?</div>
        <div class="learnplus-flex-horizontal">
        <button class="learnplus-button" id="learnplus-alert-signin">Sign in</button>
        <button class="learnplus-button-alt" id="learnplus-alert-signin-dismiss">No thanks</button>
    </div>
    `, false);

    $("#learnplus-alert-signin-dismiss").on('click', () => {
        localStorage.setItem('learnplus-signin-dismissed', true);
        learnplusSigninAlert();
        var hideNoticeMsg = alertMsg('Notice', `
            <div class="learnplus-alert-text-mb">You can sign in at any time by placing your mouse in the top right corner of the screen.</div>
            <div class="learnplus-flex-horizontal">
                <button class="learnplus-button" id="learnplus-alert-signin-dismiss-2">Ok</button>
            </div>
        `, false);
        $("#learnplus-alert-signin-dismiss-2").on('click', () => {
            hideNoticeMsg();
        });
    });
    
    $("#learnplus-alert-signin").on('click', () => {
        showLoginRegister();
        learnplusSigninAlert();
    });
}
