
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
    $('body').append(mainHTML.data);

    setTimeout(() => {
        scaleGridBG();
    }, 400);

    window.addEventListener('resize', () => { scaleGridBG(); });
    $('#lf-fill-background-grid').resizer(function() { scaleGridBG(); });

    $("#lf-login-panel-button").on('click', () => {
        var username = $("#lf-login-panel-username").val();
        var password = $("#lf-login-panel-password").val();

        if (username == '' || password == '') {
            $("#lf-login-panel-error").removeClass('lf-opacity-hidden');
            $("#lf-login-panel-error").text("Please enter a username and password");
            return;
        }

        $("#lf-login-panel-error").addClass('lf-opacity-hidden');

        login(username, password, (error) => {
            if (error) {
                $("#lf-login-panel-error").removeClass('lf-opacity-hidden');
                $("#lf-login-panel-error").text(error);
            } else {
                $("#lf-login-panel-error").addClass('lf-opacity-hidden');
            }
        });
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