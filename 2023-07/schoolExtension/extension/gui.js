var globalBrowser = chrome || browser;

const getUrl = (url) => globalBrowser.runtime.getURL(url);

var nContainer = $(`<div class="n-container">`);
$('body').append(nContainer);

function calculateBounds(target, x, y) {
    return [
        Math.max(Math.min(x, window.innerWidth - target.offsetWidth), 0),
        Math.max(Math.min(y, window.innerHeight - target.offsetHeight), 0)
    ]
}

function calculateWidthBounds(target, width, height) {
    return [
        Math.max(Math.min(width, window.innerWidth - target.getBoundingClientRect().left), 20),
        Math.max(Math.min(height, window.innerHeight - target.getBoundingClientRect().top), 50)
    ]
}

function setXY(target, x, y, bounded = false) {
    if (bounded) [x, y] = calculateBounds(target, x, y);
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function getXY(target) {
    return [
        parseFloat(target.getAttribute('data-x')) || 0,
        parseFloat(target.getAttribute('data-y')) || 0
    ]
}

var windowId = 1;
var windows = [];

class NWindow {
    constructor(title, width = 0, height = 0, resize = false, restrict = { min: { width: 200, height: 200 }, max: { width: 1000, height: 1000 } }) {
        width = Math.max(width, restrict.min.width);
        height = Math.max(height, restrict.min.height);
        width = Math.min(width, restrict.max.width);
        height = Math.min(height, restrict.max.height);

        this.title = title;
        this.width = width;
        this.height = height;
        this.resize = resize;
        this.restrict = restrict;
        this.id = windowId++;

        windows.push(this);
    }

    create(content) {
        this.window = {
            window: $(`<div class="n-window ${this.resize ? 'n-resizable' : ''}" style="width: ${this.width}px; height: ${this.height}px;">`),
            container: $(`<div class="n-window-container">`),
            titlebar: $(`<div class="n-titlebar flex-between">`),
            title: $(`<div class="n-title">${this.title}</div>`),
            buttons: $(`<div class="n-titlebar-buttons flex-between">`),
            content: $(`<div class="n-content">${content}</div>`)
        };

        this.window.window.on('mousedown', () => {
            this.window.window.css('zIndex', ++windowId + 9999);
        });
        
        this.window.titlebar.append(this.window.title);
        this.window.titlebar.append(this.window.buttons);
        this.window.container.append(this.window.titlebar);
        this.window.container.append(this.window.content);
        this.window.window.append(this.window.container);

        const createTitlebarButton = (url) => {
            return $(`<div class="n-titlebar-button flex-center"><div style="background-image: url(${url});"></div></div>`);
        }

        var minimize = createTitlebarButton(getUrl('assets/icons/minimize.svg'));
        var maximize = createTitlebarButton(getUrl('assets/icons/maximize.svg'));
        var close = createTitlebarButton(getUrl('assets/icons/close.svg'));

        minimize.click(() => {
            minimizeWindow(this);
        });

        maximize.click(() => {
            this.window.window.toggleClass('n-maximized');
            if (!this.window.window.hasClass('n-maximized')) {
                this.window.window.css('transition', 'width 0.2s cubic-bezier(.19,1,.22,1), height 0.2s cubic-bezier(.19,1,.22,1), top 0.2s cubic-bezier(.19,1,.22,1), left 0.2s cubic-bezier(.19,1,.22,1), transform 0.2s cubic-bezier(.19,1,.22,1)');
                setTimeout(() => {
                    this.window.window.css('transition', '');
                }, 200);
            }
        });

        close.click(() => {
            this.window.window.remove();
        });

        this.window.buttons.append(minimize);
        this.window.buttons.append(maximize);
        this.window.buttons.append(close);
        
        nContainer.append(this.window.window);

        if (this.resize) {
            interact(this.window.window[0]).resizable({
                edges: { top: true, left: true, bottom: true, right: true },
                modifiers: [
                    interact.modifiers.restrictEdges({
                        outer: {
                            top: 0,
                            left: 0
                        }
                    }),
                    interact.modifiers.restrictSize(this.restrict)
                ]
            }).on('resizemove', (event) => {
                if (this.window.window.hasClass('n-maximized')) return;
                
                var target = event.target;
                var [x, y] = getXY(target);
                
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                var [bWidth, bHeight] = calculateWidthBounds(target, event.rect.width, event.rect.height);
                
                target.style.width = bWidth + 'px';
                target.style.height = bHeight + 'px';

                var [bX, bY] = calculateBounds(target, x, y);
                
                target.style.webkitTransform = target.style.transform = 'translate(' + bX + 'px,' + bY + 'px)';
                
                setXY(target, x, y);
            }).on('resizestart', (event) => {
                if (this.window.window.hasClass('n-maximized')) return;

                var target = event.target;
                var [x, y] = getXY(target);
                setXY(target, x, y, true);
            });
        }

        interact(this.window.titlebar[0]).draggable({}).on('dragmove', (event) => {
            if (this.window.window.hasClass('n-maximized')) return;

            var target = this.window.window[0];
            var [x, y] = getXY(target);
            
            x += event.dx;
            y += event.dy;

            var [bX, bY] = calculateBounds(target, x, y);
            
            target.style.webkitTransform = target.style.transform =
                'translate(' + bX + 'px,' + bY + 'px)';
            
            setXY(target, x, y);
        }).on('dragstart', (event) => {
            if (this.window.window.hasClass('n-maximized')) return;

            var target = this.window.window[0];
            var [x, y] = getXY(target);
            setXY(target, x, y, true);
        });
    }
}

window.addEventListener('resize', function() {
    $('.n-window:not(.n-window-minimized)').each(function() {
        /** @type {HTMLElement} */
        var win = $(this)[0];
        if (win.classList.contains('n-maximized')) return;

        const xOff = () => win.getBoundingClientRect().left + win.offsetWidth > window.innerWidth;
        const yOff = () => win.getBoundingClientRect().top + win.offsetHeight > window.innerHeight;

        // if off of screen, move back on
        if (xOff() || yOff()) {
            var [x, y] = getXY(win);
            [x, y] = calculateBounds(win, x, y);
            
            setXY(win, x, y);

            win.style.webkitTransform = win.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            if (!win.classList.contains('n-resizable')) return;

            if (xOff()) {
                win.style.width = Math.max(window.innerWidth - win.getBoundingClientRect().left, 50) + 'px';
            }

            if (yOff()) {
                win.style.height = Math.max(window.innerHeight - win.getBoundingClientRect().top, 50) + 'px';
            }
        }
    });
});

var minimizedWindows = [];
var minimizeView = $('<div class="n-minimize-view"></div>');
nContainer.append(minimizeView);

function minimizeWindow(win) {
    win.window.window.addClass('n-window-minimized');
    minimizedWindows.push(win);

    var minimizeViewItem = $(`
        <div class="n-minimize-view-item">
            <div class="n-minimize-view-item-title">${win.title}</div>
        </div>
    `);
    minimizeView.append(minimizeViewItem);

    minimizeViewItem.click(() => {
        maximizeWindow(win.window.window);
        minimizedWindows.splice(minimizedWindows.indexOf(win), 1);
        minimizeViewItem.css('opacity', '0');
        setTimeout(() => {
            minimizeViewItem.remove();
        }, 100);
    });

    setTimeout(() => {
        maximizeWindow(win);
    }, 500);
}

function maximizeWindow(win) {
    win.css('transition', 'opacity 0.1s ease, filter 0.1s ease, transform 0.5s cubic-bezier(.36,.79,0,1), width 0.25s ease, height 0.25s ease');
    setTimeout(() => {
        win.css('transition', '');
    }, 500);
    win.removeClass('n-window-minimized');
}

