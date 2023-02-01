/** @type {HTMLDivElement} */
var learnplus_wrapper = null;
/** @type {HTMLDivElement} */
var msgpanel_wrapper = null;
/** @type {HTMLDivElement} */
var toolbar = null;

function initElements() {
    learnplus_wrapper = document.getElementById('learnplus-wrapper');
    msgpanel_wrapper = document.getElementById('learnplus-msgpanel-wrapper');
    toolbar = document.getElementById('learnplus-toolbar');

    handleToolbar();
    dragToScrollHorizontal($("#learnplus-msgpanel-wrapper"));
    handleChannelVisuals();
}

function handleToolbar() {
    handleToolbarPopups();
    unlockToolbar();

    $(".learnplus-toolbar-icon").on('click', function() {
        if ($(this).hasClass("lp-toolbar-ignore-default")) return;
        var active = $(".lp-toolbar-active");

        if (active.length > 0 && active[0] !== this) {
            active.removeClass("lp-toolbar-active");
            $(".lp-called-active").removeClass("lp-called-active");
        }
        
        $(this).toggleClass("lp-toolbar-active");

        var opens = $(this).attr("data-opens");
        if (opens) $("#" + opens).toggleClass("lp-called-active");

        if ($(this).hasClass("lp-toolbar-active")) {
            lockToolbar();
        } else {
            suggestUnlockToolbar();
        }
    });

    $("#lock-toolbar-btn").on('click', function() {
        $(".lp-toolbar-active").removeClass("lp-toolbar-active");
        $(".lp-called-active").removeClass("lp-called-active");

        var popup = $(this).find(".learnplus-toolbar-icon-popup");
        var icon = $(this).find("i");

        if (icon.hasClass("fa-lock")) unlockToolbar();
        else lockToolbar(true);

        if (toolbarLocked) {
            popup.text("Unlock Toolbar");
            icon.removeClass("fa-unlock");
            icon.addClass("fa-lock");
        }
        else {
            popup.text("Lock Toolbar");
            icon.removeClass("fa-lock");
            icon.addClass("fa-unlock");
        }

        console.log(toolbarLocked);
    });

    handleLoginForm();
}

function handleToolbarPopups() {
    var popups = $(".learnplus-toolbar-icon-popup");
    popups.each(function() {
        // If the leftmost of the popup is off the screen, move it to the right
        var popup = $(this);
        var popupLeft = popup.offset().left;
        var popupWidth = popup.width();
        var windowWidth = $(window).width();

        if (popupLeft + (popupWidth + 20) > windowWidth) {
            popup.css('right', 5);
            popup.css('left', '');
        }

        // If the rightmost of the popup is off the screen, move it to the left
        popupLeft = popup.offset().left;
        if (popupLeft < 0) {
            popup.css('left', 5);
        }
    });
}

function setCSSVar(varName, value) {
    document.documentElement.style.setProperty(varName, value);
}

var toolbarLocked = false;
var forceLockToolbar = false;

function lockToolbar(force) {
    if (force) forceLockToolbar = true;
    if (toolbarLocked) return;
    toolbarLocked = true;
    $(".lp-raise-for-toolbar").addClass("lp-raise-for-toolbar-locked");
    $("#learnplus-toolbar").addClass("learnplus-toolbar-locked");
}

function unlockToolbar() {
    if (!toolbarLocked) return;
    toolbarLocked = false;
    forceLockToolbar = false;
    $(".lp-raise-for-toolbar").removeClass("lp-raise-for-toolbar-locked");
    $("#learnplus-toolbar").removeClass("learnplus-toolbar-locked");
}

function suggestUnlockToolbar() {
    if (forceLockToolbar) return;
    unlockToolbar();
}

function toggleToolbar() {
    if (toolbarLocked) {
        unlockToolbar();
    } else {
        lockToolbar(true);
    }
}

function handleLoginForm() {
    $("#learnplus-show-register").on('click', showRegisterForm);
    $("#learnplus-show-login").on('click', showLoginForm);
    showLoginForm();

    $("#learnplus-login-form").on('submit', function(e) {
        var username = $("#learnplus-login-username").val();
        var password = $("#learnplus-login-password").val();

        if (username.length === 0 || password.length === 0) {
            showAlert("Please fill in all fields.")
            return;
        }

        socket.emit('login', {
            username: username,
            password: password
        }, (res) => {
            if (res.success) {
                showAlert("Logged in successfully.");
                swapToLogoutFromForm();

                var token = res.data.token;
                chrome.storage.sync.set({token: token}, function() {
                    logMsg("Token saved to storage.");
                });
            } else {
                showAlert(res.error);
            }
        });
    });

    $("#learnplus-register-form").on('submit', function(e) {
        var username = $("#learnplus-register-username").val();
        var email = $("#learnplus-register-email").val();
        var password = $("#learnplus-register-password").val();
        var passwordConfirm = $("#learnplus-register-password-confirm").val();

        if (username.length === 0 || email.length === 0 || password.length === 0 || passwordConfirm.length === 0) {
            showAlert("Please fill in all fields.");
            return;
        }

        if (password !== passwordConfirm) {
            showAlert("Passwords do not match.");
            return;
        }
        
        if (password.length < 8) {
            showAlert("Password must be at least 8 characters long.");
            return;
        }

        socket.emit('register', {
            username: username,
            email: email,
            password: password
        }, (res) => {
            if (res.success) {
                showAlert("Account created!");
                swapToLogoutFromForm();

                var token = res.data.token;
                chrome.storage.sync.set({token: token}, function() {
                    logMsg("Token saved to storage.");
                });
            } else {
                showAlert(res.error);
            }
        });
    });

    chrome.storage.sync.get(['token'], function(result) {
        var token = result.token;
        if (token) {
            socket.emit('loginToken', {
                token: token
            }, (res) => {
                if (!res.success) {
                    chrome.storage.sync.remove('token', function() {
                        logMsg("Token removed from storage due to authentication failure.");
                        $("#learnplus-logout-btn").hide();
                    });
                } else {
                    logMsg("Token authentication successful.");
                    $("#learnplus-login-btn").hide();
                    loadChannelBrowser();
                }
            });
        } else {
            $("#learnplus-logout-btn").hide();
        }
    });

    $("#learnplus-logout-btn").on('click', function() {
        chrome.storage.sync.remove('token', function() {
            logMsg("Token removed from storage.");
            location.reload();
        });
    });
}

function showLoginForm() {
    $("#learnplus-login-form").show();
    $("#learnplus-register-form").hide();
}

function showRegisterForm() {
    $("#learnplus-login-form").hide();
    $("#learnplus-register-form").show();
}

function showAlert(msg) {
    alert(msg);
}

function swapToLogoutFromForm() {
    $("#learnplus-login-btn").hide();
    $("#learnplus-logout-btn").show();
    $(".lp-toolbar-active").removeClass("lp-toolbar-active");
    $(".lp-called-active").removeClass("lp-called-active");
    suggestUnlockToolbar();
}

function handleChannelVisuals() {
    $("#lp-create-channel-form").on('submit', function(e) {
        var channelName = $("#lp-create-channel-name").val();
        createChannel(channelName, true);
    });
}