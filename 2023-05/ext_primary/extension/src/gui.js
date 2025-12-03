const _classPrefix = "ext-prim";

function genClassName(name) {
    return `${_classPrefix}-${name}`;
}

function createElement(className, content, tag = "div", id = null, css = null) {
    const element = document.createElement(tag);
    element.className = className;
    element.innerHTML = content;
    if (id) element.id = id;
    if (css) element.style = css;
    return element;
}

const windowPositions = {
    TOP_LEFT: "top: 0; left: 0;",
    TOP_RIGHT: "top: 0; right: 0;",
    BOTTOM_LEFT: "bottom: 0; left: 0;",
    BOTTOM_RIGHT: "bottom: 0; right: 0;"
};

const windowSizes = {
    WIDTH_FULL: "width: 100%;",
    HEIGHT_FULL: "height: 100%;",
    FULL: "width: 100%; height: 100%;",
    NONE: ""
}

function createWindow(content, className = "", position = windowPositions.TOP_LEFT, size = windowSizes.NONE) {
    const window = createElement(genClassName("window"), content, "div", null, `${position} ${size}`);
    window.classList.add(genClassName(className));
    return window;
}

