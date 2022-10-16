const socketIO = io; // Backup in the case that the head gets removed.
const socket = socketIO('http://localhost:8080');


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

var html = `
<div id="learnsharp-panel" class="inactive">
    <p>LearnSharp</p>
</div>

<style>
#learnsharp-panel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: grey;
    z-index: 99999;
    transition: transform 0.5s cubic-bezier(.74,.2,.4,1);
}

#learnsharp-panel.inactive {
    transform: translateX(-100%);
}

#mfeAppShellAlert {
    display: none; /* TEMPORARY */
}
</style>
`;

$("body").append(html);

(async () => {
    // Wait for .sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right to load
    await new Promise(resolve => {
        var interval = setInterval(function() {
            if ($(".sa-navigation-controls-content.h-group.v-align-center.h-align-space-between.align-right").length) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });

    await new Promise(resolve => { setTimeout(resolve, 1000); });

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
})();