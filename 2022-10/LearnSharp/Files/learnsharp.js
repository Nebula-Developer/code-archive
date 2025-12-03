const socketIO = io; // Backup in the case that the head gets removed.
const socket = socketIO('http://localhost:8080', { transports: ['websocket'] });
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
    console.log(browser);

    socket.emit('message', 'Hello from the browser!');

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
    var panel = `
    <div id='panel' class='inactive'>
        <p>No</p>
    </div>

    <style>
    #panel {
        position: fixed;
        top: 0;
        left: 0;
        background: hotpink;
        width: 100vw;
        height: 100vh;
        z-index: 9999999;
        color: orange;
        transition: 0.5s ease;
        transform: translateX(0);
    }

    #panel.inactive {
        transform: translateX(-100vw);
    }
    </style>
    `;

    $("body").append(panel);

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.code == 'KeyL') {
            event.preventDefault();
            $("#panel").toggleClass("inactive");
        }
    });
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

    setInterval(() => {
        if ($(".learnsharp-ep-skip-btn").length == 0 || $("#learnsharp-ep-skip").length == 0) {
            console.log('a');
            $(".learnsharp-ep-skip-btn").remove();
            $("#learnsharp-ep-skip").remove();

            $(".sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right").append(`
            <div class="continue arrow action-bar-button v-group learnsharp-ep-skip-btn" sidebar="self.model.sidebarMode" walkthrough-position="top">
                <button id="skip-btn" class="learnsharp-ep-btn">
                    <span ng-hide="self.sidebar" class="abb-label" ng-transclude="">
                    <span class="ng-binding ng-scope"> Skip </span></span>
                    <span class="highlight"></span>
                </button>
                <div class="sidemode-label ng-hide">
                    <span class="ng-binding ng-scope"> Skip </span>
                </div>
            </div>

            <div class="continue arrow action-bar-button v-group learnsharp-ep-skip-btn" sidebar="self.model.sidebarMode" walkthrough-position="top">
                <button id="skip-sec-btn" class="learnsharp-ep-btn">
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
        }

        // clear $("#skip-btn") click events
        $("#skip-btn").off("click");

        $("#skip-btn").on('click', function() {
            var elms = $(".h-group.v-align-center.expanded-content.information.selected");
            if (elms.length > 0) {
                var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');
    
                // Make sure we dont click the button we just clicked.
                for (var i = 0; i < btn.length; i++) {
                    if (btn[i].classList.contains("learnsharp-ep-btn"))
                            continue;

                        console.log(btn[i]);
    
                    btn[i].click();
                }
            }
        });

        $("#skip-sec-btn").off("click");
    
        $("#skip-sec-btn").on('click', async function() {
            while (true) {
                var elms = $(".h-group.v-align-center.expanded-content.information.selected");
                if (elms.length > 0) {
                    var btn = $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").find('button');
        
                    for (var i = 0; i < btn.length; i++) {
                        // Check if has class
                        if (btn[i].classList.contains("learnsharp-ep-btn"))
                            continue;
                            
                        btn[i].click();
                    }
                } else break;
    
                await new Promise(resolve => { setTimeout(resolve, 100); });
            }
        });
    }, 100);

    setInterval(() => {
        if ($(".h-group.v-align-center.expanded-content.information.selected").length > 0) {
            $(".continue.arrow.action-bar-button.v-group:not(.ng-isolate-scop)").css("display", "block");
            $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope").css("display", "none");
        } else {
            $(".continue.arrow.action-bar-button.v-group:not(.ng-isolate-scop)").css("display", "none");
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