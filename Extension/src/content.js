
function getFile(file) {
    return new Promise((resolve, reject) => {
        socket.emit('getFile', file, (data) => {
            resolve(data);
        });
    });
}

async function loadContent() {
    $("#learnflow-css").remove();
    $("#learnflow-wrapper").remove();
    var mainCSS = await getFile('css/main.css');
    var mainHTML = await getFile('html/main.html');

    if (!mainCSS.success || !mainHTML.success) {
        console.error("Failed to load LearnFlow content from https://flow.nebuladev.net");
        return;
    }

    $('head').append('<style type="text/css" id="learnflow-css">' + mainCSS.data + '</style>');
    $('body').append('<div id="learnflow-wrapper">' + mainHTML.data + '</div>');

    setTimeout(() => {
        scaleGridBG();
    }, 400);

    window.addEventListener('resize', () => { scaleGridBG(); });
    // $('#lf-fill-background-grid').resizer(function() { scaleGridBG(); });

    $("#lf-login-panel-button").on('click', () => {
        var username = $("#lf-login-panel-username").val();
        var password = $("#lf-login-panel-password").val();

        if (username == '' || password == '') {
            $("#lf-login-panel-error").removeClass('lf-opacity-hidden');
            $("#lf-login-panel-error").text("Please enter a username and password");
            return;
        }

        $("#lf-login-panel-error").addClass('lf-opacity-hidden');

        login(username, password, (res) => {
            if (!res.success) {
                $("#lf-login-panel-error").removeClass('lf-opacity-hidden');
                console.log(res);
                $("#lf-login-panel-error").text(res.error);
            } else {
                $("#lf-login-wrapper").addClass('lf-opacity-hidden');
            }
        });
    });

    $("#lf-register-panel-button").on('click', () => {
        var username = $("#lf-register-panel-username").val();
        var email = $("#lf-register-panel-email").val();
        var password = $("#lf-register-panel-password").val();
        var password_confirm = $("#lf-register-panel-password-confirm").val();

        if (username == '' || password == '') {
            $("#lf-register-panel-error").removeClass('lf-opacity-hidden');
            $("#lf-register-panel-error").text("Please enter a username and password");
            return;
        }

        $("#lf-register-panel-error").addClass('lf-opacity-hidden');

        login(username, password, (res) => {
            if (!res.success) {
                $("#lf-register-panel-error").removeClass('lf-opacity-hidden');
                console.log(res);
                $("#lf-register-panel-error").text(res.error);
            } else {
                $("#lf-login-wrapper").addClass('lf-opacity-hidden');
            }
        });
    })

    // when the mouse enters, set --lf-login-panel-background-gap to 3, and on exit set it back to 1
    $(".lf-login-panel-wrapper").on('mouseenter', () => {
        document.documentElement.style.setProperty('--lf-login-panel-background-gap', '0.5px');
        document.documentElement.style.setProperty('--lf-login-panel-background-rotate', '0');
        document.documentElement.style.setProperty('--lf-login-panel-background-scale', '1');
        document.documentElement.style.setProperty('--lf-login-panel-background-blur', '2px');
    });
    $(".lf-login-panel-wrapper").on('mouseleave', () => {
        document.documentElement.style.setProperty('--lf-login-panel-background-gap', '3px');
        document.documentElement.style.setProperty('--lf-login-panel-background-rotate', '10deg');
        document.documentElement.style.setProperty('--lf-login-panel-background-scale', '1.5');
        document.documentElement.style.setProperty('--lf-login-panel-background-blur', '5px');
    });

    $("#lf-login-wrapper").on('mousedown', (e) => {
        if (e.target.id == 'lf-login-wrapper') {
            $("#lf-login-wrapper").addClass('lf-opacity-hidden');
        }
        console.log(e.target.id);
    });

    showAlert('Sign out', 'Are you sure you would like to sign out?', [
        {
            text: 'YES',
            callback: (elm) => {
                chrome.storage.local.remove('token', () => {
                    tryGetToken();
                });
                hideAlert(elm);
            }
        },
        {
            text: 'NO',
            callback: (elm) => {
                hideAlert(elm);
            }
        }
    ]);

    tryGetToken();

    $(".lf-disable-glow-switch").on('click', () => {
        if ($(".lf-disable-glow-switch").hasClass('lf-switch-active')) {
            $(".lf-disable-glow-switch").removeClass('lf-switch-active');
            chrome.storage.local.set({disableGlow: true});
            disableGlow();
        } else {
            $(".lf-disable-glow-switch").addClass('lf-switch-active');
            chrome.storage.local.set({disableGlow: false});
            enableGlow();
        }
    });

    chrome.storage.local.get(['disableGlow'], (res) => {
        if (res.disableGlow == true) {
            $(".lf-disable-glow-switch").removeClass('lf-switch-active');
            disableGlow();
        } else {
            $(".lf-disable-glow-switch").addClass('lf-switch-active');
            enableGlow();
        }
    });

    $("#lf-show-register").on('click', () => { showRegisterForm(); });
    $("#lf-show-login").on('click', () => { showLoginForm(); });
}

function scaleGridBG() {
    var bg = $('#lf-fill-background-grid');
    // Divide width by 50 and set the grid column count to that
    // and row count, then create div*div divs and append them to the grid
    var width = bg.outerWidth();
    var height = bg.outerHeight();
    
    var divs = Math.floor(width / 50);
    var divsHeight = Math.floor(height / 50);
    var divsTotal = divs * divsHeight;
    
    bg.empty();
    for (var i = 0; i < divsTotal; i++) {
        var row = Math.floor(i / divs);
        var border_radius = '';
        
        if (i == 0) border_radius = 'lf-grid-tl-br';
        if (i == divs - 1) border_radius = 'lf-grid-tr-bl';
        if (i == divsTotal - divs) border_radius = 'lf-grid-bl-tr';
        if (i == divsTotal - 1) border_radius = 'lf-grid-br-tl';

        var gridItem = $('<div class="lf-fill-background-grid-item ' + border_radius + '" style="grid-row: ' + (row + 1) + '; grid-column: ' + (i - (row * divs) + 1) + ';"></div>');
        bg.append(gridItem);
    }
    
    bg.css('grid-auto-columns', 'minmax(50px, 1fr)');
    bg.css('grid-auto-rows', 'minmax(50px, 1fr)');
}

function showAlert(title, message, buttons = [
    {
        text: 'OK',
        callback: (elm) => {
            hideAlert(elm);
        }
    }
]) {
    var elm = $('<div class="lf-notification lf-notification-appear"></div>');
    var header = $('<div class="lf-notification-header"></div>');
    var headerTitle = $('<div class="lf-notification-header-title"></div>');
    var body = $('<div class="lf-notification-body"></div>');
    var bodyContent = $('<div class="lf-notification-body-content"></div>');
    var bodyContentText = $('<div class="lf-notification-body-content-text"></div>');
    var bodyContentButtonWrapper = $('<div class="lf-notification-body-content-button-wrapper flex-center"></div>');
    
    headerTitle.text(title);
    bodyContentText.text(message);
    
    header.append(headerTitle);
    bodyContent.append(bodyContentText);
    bodyContent.append(bodyContentButtonWrapper);
    body.append(bodyContent);
    elm.append(header);
    elm.append(body);

    buttons.forEach((btn) => {
        var button = $('<button class="lf-notification-button"></button>');
        button.text(btn.text);
        var callback = btn.callback;
        button.on('mouseup', () => {
            callback(elm);
        });
        bodyContentButtonWrapper.append(button);
    });

    $('#lf-notification-wrapper').prepend(elm);
    setTimeout(() => {
        elm.removeClass('lf-notification-appear');
    }, 50);
}

function hideAlert(elm) {
    var elmY = elm.offset().top;
    elm.addClass('lf-notification-disappear');
    setTimeout(() => {
        $(".lf-notification").each((i, e) => {
            var isAbove = $(e).offset().top < elmY;
            if (!isAbove) return;
            
            $(e).css('top', '-150px');
            $(e).animate({
                top: '0px'
            }, 400);
        });
        elm.remove();
    }, 400);
}

function showLogin() {
    $("#lf-login-wrapper").removeClass('lf-opacity-hidden');
    showLoginForm();
}

function tryGetToken() {
    chrome.storage.local.get('token').then((res) => {
        if (res.token) {
            // if token exists, check if it is valid
            loginToken(res.token);
        } else {
            showAlert("You are not logged in", "Would you like to login to LearnFlow?", [
                {
                    text: "OK",
                    callback: (elm) => {
                        showLogin();
                        hideAlert(elm);
                    }
                },
                {
                    text: "NO",
                    callback: (elm) => {
                        hideAlert(elm);
                    }
                }
            ]);
        }
    });
}

function loadGlowElms() {
    return [
        $("#lf-login-wrapper"),
        $("#lf-login-background-gradient"),
        $(".lf-login-panel"),
        $("#lf-notification-wrapper"),
        $(".lf-disable-glow-switch")
    ]
}

function disableGlow() {
    loadGlowElms().forEach((elm) => {
        elm.addClass('lf-no-glow');
    });
}

function enableGlow() {
    loadGlowElms().forEach((elm) => {
        elm.removeClass('lf-no-glow');
    });
}

function showLoginForm() {
    $("#lf-register-panel").addClass('lf-hidden');
    $("#lf-login-panel").removeClass('lf-hidden');
}

function showRegisterForm() {
    $("#lf-register-panel").removeClass('lf-hidden');
    $("#lf-login-panel").addClass('lf-hidden');
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key == 'o' && e.shiftKey) {
        loadContent();
    }
    console.log(e);
})