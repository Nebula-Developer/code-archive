var globalBrowser = chrome || browser;

const getUrl = (url) => globalBrowser.runtime.getURL(url);

function calculateBounds(target, x, y) {
    return [
        Math.max(Math.min(x, window.innerWidth - target.offsetWidth), 0),
        Math.max(Math.min(y, window.innerHeight - target.offsetHeight), 0)
    ]
}

function calculateWidthBounds(target, width, height) {
    return [
        Math.max(Math.min(width, window.innerWidth - target.getBoundingClientRect().left), 0),
        Math.max(Math.min(height, window.innerHeight - target.getBoundingClientRect().top), 0)
    ]
}

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
    }

    create(content) {
        this.window = {
            window: $(`<div class="n-window" style="width: ${this.width}px; height: ${this.height}px;">`),
            container: $(`<div class="n-window-container">`),
            titlebar: $(`<div class="n-titlebar flex-between">`),
            title: $(`<div class="n-title">${this.title}</div>`),
            buttons: $(`<div class="n-titlebar-buttons flex-between">`),
            content: $(`<div class="n-content">${content}</div>`)
        };
        
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

        this.window.buttons.append(minimize);
        this.window.buttons.append(maximize);
        this.window.buttons.append(close);
        
        $('body').append(this.window.window);

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
            }).on('resizemove', function (event) {
                var target = event.target;
                var x = (parseFloat(target.getAttribute('data-x')) || 0);
                var y = (parseFloat(target.getAttribute('data-y')) || 0);
                
                x += event.deltaRect.left;
                y += event.deltaRect.top;

                var [bWidth, bHeight] = calculateWidthBounds(target, event.rect.width, event.rect.height);
                
                target.style.width = bWidth + 'px';
                target.style.height = bHeight + 'px';

                var [bX, bY] = calculateBounds(target, x, y);
                
                target.style.webkitTransform = target.style.transform =
                    'translate(' + bX + 'px,' + bY + 'px)';
                
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }).on('resizestart', function (event) {
                var target = event.target;
                var x = (parseFloat(target.getAttribute('data-x')) || 0);
                var y = (parseFloat(target.getAttribute('data-y')) || 0);
                x = Math.min(Math.max(x, 0), window.innerWidth - target.offsetWidth);
                y = Math.min(Math.max(y, 0), window.innerHeight - target.offsetHeight);
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            });
        }

        interact(this.window.titlebar[0]).draggable({
            modifiers: [
                
            ]
        }).on('dragmove', (event) => {
            var target = this.window.window[0];
            var x = (parseFloat(target.getAttribute('data-x')) || 0);
            var y = (parseFloat(target.getAttribute('data-y')) || 0);
            
            x += event.dx;
            y += event.dy;

            var [bX, bY] = calculateBounds(target, x, y);
            
            target.style.webkitTransform = target.style.transform =
                'translate(' + bX + 'px,' + bY + 'px)';
            
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }).on('dragstart', (event) => {
            var target = this.window.window[0];
            var x = (parseFloat(target.getAttribute('data-x')) || 0);
            var y = (parseFloat(target.getAttribute('data-y')) || 0);
            x = Math.min(Math.max(x, 0), window.innerWidth - target.offsetWidth);
            y = Math.min(Math.max(y, 0), window.innerHeight - target.offsetHeight);
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        });
    }
}

window.addEventListener('resize', function() {
    $('.n-window:not(.n-window-minimized)').each(function() {
        /** @type {HTMLElement} */
        var win = $(this)[0];

        // if off of screen, move back on
        if (win.getBoundingClientRect().left + win.offsetWidth > window.innerWidth ||
            win.getBoundingClientRect().top + win.offsetHeight > window.innerHeight) {
            var x = (parseFloat(win.getAttribute('data-x')) || 0);
            var y = (parseFloat(win.getAttribute('data-y')) || 0);
            x = Math.max(Math.min(x, window.innerWidth - win.offsetWidth), 0);
            y = Math.max(Math.min(y, window.innerHeight - win.offsetHeight), 0);
            win.setAttribute('data-x', x);
            win.setAttribute('data-y', y);
            win.style.webkitTransform = win.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            if (win.getBoundingClientRect().left + win.offsetWidth > window.innerWidth) {
                win.style.width = window.innerWidth - win.getBoundingClientRect().left + 'px';
            }

            if (win.getBoundingClientRect().top + win.offsetHeight > window.innerHeight) {
                win.style.height = window.innerHeight - win.getBoundingClientRect().top + 'px';
            }
        }
    });
});

function minimizeWindow(win) { win.addClass('n-window-minimized'); }
function maximizeWindow(win) { win.removeClass('n-window-minimized'); }

