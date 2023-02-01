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

    handleToolbarPopups();
    dragToScrollHorizontal($("#learnplus-msgpanel-wrapper"));
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

function dragToScrollHorizontal(jqueryElm) {
    var elm = jqueryElm[0];
    var isDragging = false;
    var lastX = 0;
    var lastScrollLeft = 0;

    jqueryElm.on('mousedown', function(e) {
        // Make sure we are not selecting a child
        if (e.target !== elm && !e.target.classList.contains('lp-msg-panel')) {
            console.log(e.target);
            console.log(elm);
            return;
        }

        e.preventDefault();
        isDragging = true;
        lastX = e.clientX;
        lastScrollLeft = elm.scrollLeft;

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
                var deltaX = e.clientX - lastX;
                elm.scrollLeft = lastScrollLeft - deltaX;
            }
        });
    });
}

function setCSSVar(varName, value) {
    document.documentElement.style.setProperty(varName, value);
}

var toolbarLocked = false;

function lockToolbar() {
    if (toolbarLocked) return;
    toolbarLocked = true;
    $(".lp-raise-for-toolbar").addClass("lp-raise-for-toolbar-locked");
    $("#learnplus-toolbar").addClass("learnplus-toolbar-locked");
}

function unlockToolbar() {
    if (!toolbarLocked) return;
    toolbarLocked = false;
    $(".lp-raise-for-toolbar").removeClass("lp-raise-for-toolbar-locked");
    $("#learnplus-toolbar").removeClass("learnplus-toolbar-locked");
}