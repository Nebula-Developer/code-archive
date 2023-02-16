
function getFile(file) {
    return new Promise((resolve, reject) => {
        socket.emit('getFile', file, (data) => {
            resolve(data);
        });
    });
}

async function loadContent() {
    var mainCSS = await getFile('css/main.css');
    var mainHTML = await getFile('html/main.html');

    if (!mainCSS.success || !mainHTML.success) {
        console.error("Failed to load LearnFlow content from https://flow.nebuladev.net");
        return;
    }

    $('head').append('<style type="text/css">' + mainCSS.data + '</style>');
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

    for (var i = 0; i < 10; i++) {
        showAlert("test", "hello, world!", [
            {
                text: "OK!",
                callback: (elm) => {
                    hideAlert(elm);
                }
            },
            {
                text: "Nope",
                callback: (elm) => {
                    alert('test')
                }
            }
        ]);

        await new Promise(r => setTimeout(r, 5));
    }

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

    $('#lf-notification-wrapper').append(elm);
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
            }, 200);
        });
        elm.remove();
    }, 200);
}