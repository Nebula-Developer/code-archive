
function getFile(file) {
    return new Promise((resolve, reject) => {
        socket.emit('getFile', file, (data) => {
            resolve(data);
        });
    });
}

async function loadContent() {
    var mainLESS = await getFile('css/main.less');
    var mainHTML = await getFile('html/main.html');

    if (!mainLESS.success || !mainHTML.success) {
        console.error("Failed to load LearnFlow content from https://flow.nebuladev.net");
        return;
    }

    $('head').append('<style type="text/less">' + mainLESS.data + '</style>');
    $('head').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/4.1.3/less.min.js" integrity="sha512-6gUGqd/zBCrEKbJqPI7iINc61jlOfH5A+SluY15IkNO1o4qP1DEYjQBewTB4l0U4ihXZdupg8Mb77VxqE+37dg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>');
    $('body').append(mainHTML.data);

    setTimeout(() => {
        scaleGridBG();
    }, 400);

    window.addEventListener('resize', () => { scaleGridBG(); });
}

function scaleGridBG() {
    var bg = $('#lf-fill-background-grid');
    // Divide width by 50 and set the grid column count to that
    // and row count, then create div*div divs and append them to the grid
    var width = bg.outerWidth();
    var height = bg.outerHeight();
    console.log(width);
    
    var divs = Math.floor(width / 50);
    var divsHeight = Math.floor(height / 50);
    var divsTotal = divs * divsHeight;
    console.log(divsTotal);
    bg.empty();
    for (var i = 0; i < divsTotal; i++) {
        var row = Math.floor(i / divs);
        var border_radius = '';
        
        if (i == 0) border_radius = 'lf-grid-tl-br';
        if (i == divs - 1) border_radius = 'lf-grid-tr-bl';
        if (i == divsTotal - divs) border_radius = 'lf-grid-bl-tr';
        if (i == divsTotal - 1) border_radius = 'lf-grid-br-tl';
        console.log(border_radius);

        var gridItem = $('<div class="lf-fill-background-grid-item ' + border_radius + '" style="grid-row: ' + (row + 1) + '; grid-column: ' + (i - (row * divs) + 1) + ';"></div>');
        bg.append(gridItem);
    }
    
    bg.css('grid-auto-columns', 'minmax(50px, 1fr)');
    bg.css('grid-auto-rows', 'minmax(50px, 1fr)');
}