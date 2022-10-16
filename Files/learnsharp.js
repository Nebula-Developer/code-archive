const socketIO = io; // Backup in the case that the head gets removed.
const socket = socketIO('http://localhost:8080');
var browser = null;

function setLocalItem(item, val) {
    browser.storage.local.set({ [item]: val });
}

function getLocalItem(item) {
    return new Promise(resolve => {
        browser.storage.local.get(item, function(result) {
            resolve(result[item]);
        });
    });
}

function init(b) {
    browser = b;

    detectPage();
}

var keybinds = {
    "win": {
        "alt": true,
        "key": 'KeyL'
    }
}

function checkKeybind(keybind, event) {
    var alt = keybind.alt ? event.altKey : true;
    var ctrl = keybind.ctrl ? event.ctrlKey : true;
    var shift = keybind.shift ? event.shiftKey : true;
    var meta = keybind.meta ? event.metaKey : true;

    var mods = alt && ctrl && shift && meta;
    return mods && keybind.key == event.code;
}

document.addEventListener('keydown', function(event) {
    if (checkKeybind(keybinds.win, event)) {
        event.preventDefault();
        $("#learnsharp-panel").toggleClass("inactive");
    }
});








// ------------------
// Page modifications
// ------------------

function detectPage() {
    global();

    if (location.href.includes("educationperfect.com")) educationPerfect();
}

async function global() {
    var loginToken = await getLocalItem("learnSharpLocalACC");

    if (loginToken) {

    } else {
        // Show login screen
        var loginPanel = document.createElement("div");
        loginPanel.id = "learnsharp-login-panel";
        loginPanel.innerHTML = `
            <div style='display: none' class="learnsharp-login-panel-inner">
                <h1>LearnSharp</h1>
                <p>LearnSharp is a browser extension that allows you to learn more efficiently.</p>
                <p>Sign in to get started.</p>
                </br>
                <form id="learnsharp-login-form" onsubmit="return false;">
                    <input type="text" placeholder="Username" id="learnsharp-login-username">
                    <input type="password" placeholder="Password" id="learnsharp-login-password">
                    <input type="submit" value="Sign in">
                </form>
            </div>
        `;

        document.body.appendChild(loginPanel);
    }
}

async function educationPerfect() {
    // Wait for .sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right to load
    await new Promise(resolve => {
        var interval = setInterval(function() {
            if ($(".sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right").length) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    $(".sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right").append(`
    <div class="continue arrow action-bar-button v-group learnsharp-ep-skip-btn" sidebar="self.model.sidebarMode" walkthrough-position="top">
        <button id="skip-btn">
            <span ng-hide="self.sidebar" class="abb-label" ng-transclude="">
            <span class="ng-binding ng-scope"> Skip </span></span>
            <span class="highlight"></span>
        </button>
        <div class="sidemode-label ng-hide">
            <span class="ng-binding ng-scope"> Skip </span>
        </div>
    </div>

    <div class="continue arrow action-bar-button v-group learnsharp-ep-skip-btn" sidebar="self.model.sidebarMode" walkthrough-position="top">
        <button id="skip-sec-btn">
            <span ng-hide="self.sidebar" class="abb-label" ng-transclude="">
            <span class="ng-binding ng-scope"> Skip Section </span></span>
            <span class="highlight"></span>
        </button>
        <div class="sidemode-label ng-hide">
            <span class="ng-binding ng-scope"> Skip Section </span>
        </div>
    </div>

    <div class="learnsharp-ep-skip-btn">
        <input type="checkbox" id="learnsharp-ep-skip" name="learnsharp-ep-skip" value="learnsharp-ep-skip">
        <label for="learnsharp-ep-skip">Auto Skip</label>
    </div>

    <style>
    .learnsharp-ep-skip-btn {
        margin-left: 10px;
    }
    </style>
    `);

    $("#skip-btn").on('click', function() {
        var elms = $(".h-group.v-align-center.expanded-content.information.selected");
        if (elms.length > 0) {
            var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');

            // Make sure we dont click the button we just clicked.
            for (var i = 0; i < btn.length; i++) {
                if (btn[i] == this)
                    continue;

                btn[i].click();
            }
        }
    });

    $("#skip-sec-btn").on('click', async function() {
        while (true) {
            var elms = $(".h-group.v-align-center.expanded-content.information.selected");
            if (elms.length > 0) {
                var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');
    
                for (var i = 0; i < btn.length; i++) {
                    if (btn[i] == this)
                        continue;
    
                    btn[i].click();
                }
            } else break;

            await new Promise(resolve => { setTimeout(resolve, 100); });
        }
    });

    setInterval(() => {
        if ($(".information.selected").length > 0) {
            $(".continue.arrow.action-bar-button.v-group").css("display", "block");
            $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").css("display", "none");
        } else {
            $(".continue.arrow.action-bar-button.v-group").css("display", "none");
            $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").css("display", "block");
        }
    }, 100);

    while (true) {
        if ($("#learnsharp-ep-skip").is(":checked")) {
            var elms = $(".h-group.v-align-center.expanded-content.information.selected");
            if (elms.length > 0) {
                var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');

                for (var i = 0; i < btn.length; i++) {
                    btn[i].click();
                }
            }
        }

        await new Promise(resolve => { setTimeout(resolve, 100); });
    }
}