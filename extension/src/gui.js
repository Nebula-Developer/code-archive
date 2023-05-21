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

////////////// Color Panel //////////////
function createColorPanelItem(name, varName) {
    return `
        <div class="${genClassName("color-panel-item")}" id="${genClassName("color-" + varName)}">
            <div class="${genClassName("color-panel-item-label")}">${name}</div>
            <div class="${genClassName("color-panel-item-color")}">
            <input type="color" value="#ff0000" id="${genClassName("color-" + varName + "-input")}">
            </div>
            </div>`;
}

const colorPanelItems = [
    { name: "Background 1", variable: "background1" },
    { name: "Background 2", variable: "background2" },
    { name: "Background 3", variable: "background3" },

    { name: "Text 1", variable: "text1" },
    { name: "Text 2", variable: "text2" },
    { name: "Text 3", variable: "text3" },

    { name: "Accent 1", variable: "accent1" },
    { name: "Accent 2", variable: "accent2" },
    { name: "Accent 3", variable: "accent3" }
];

var colorPanelContentItemJoin = "";
for (const item of colorPanelItems)
    colorPanelContentItemJoin += createColorPanelItem(item.name, item.variable);

const colorPanelContent = `
    <div class="${genClassName("flex")} ${genClassName("color-panel-content")}">
        ${colorPanelContentItemJoin}
    </div>
`;
        
const colorPanel = createWindow(colorPanelContent, "color-panel", windowPositions.BOTTOM_LEFT, windowSizes.WIDTH_FULL);
colorPanel.style.height = "80px";

function loadColorPanel() {
    for (const item of colorPanelItems) {
        // Set variable value
        const color = getComputedStyle(document.documentElement).getPropertyValue("--" + item.variable);
        document.getElementById(genClassName("color-" + item.variable)).style.backgroundColor = color;
        document.getElementById(genClassName("color-" + item.variable + "-input")).value = color;
    }
}

function loadColorPanelListeners() {
    for (const item of colorPanelItems) {
        document.getElementById(genClassName("color-" + item.variable + "-input")).addEventListener("change", (e) => {
            document.documentElement.style.setProperty("--" + item.variable, e.target.value);
        });
    }
}
////////////// Color Panel End //////////////

////////////// Element Panel //////////////
var elementPanelColorDropdown = "";
for (const item of colorPanelItems)
    elementPanelColorDropdown += `<option value="${item.variable}">${item.name}</option>`;

const elementPanelContent = `
    <div class="${genClassName("flex")} ${genClassName("element-panel-content")}">
        <div class="${genClassName("add-element-wrapper")}">
            <div class="${genClassName("add-element-header")}">Add Element</div>
            <div class="${genClassName("add-element-input-wrapper")}">
                <input type="text" id="${genClassName("add-element-input-name")}" placeholder="Element Name">
                <input type="text" id="${genClassName("add-element-input-class")}" placeholder="Element Class">
                <input type="text" id="${genClassName("add-element-input-id")}" placeholder="Element ID">

                <input type="text" id="${genClassName("add-element-input-targets")}" placeholder="Element Targets">
                <select id="${genClassName("add-element-input-color")}">
                    ${elementPanelColorDropdown}
                </select>
            </div>
            <div class="${genClassName("add-element-button-wrapper")}">
                <button id="${genClassName("add-element-button")}">Add</button>
            </div>
        </div>
        <div class="${genClassName("element-list-wrapper")}">
            <div class="${genClassName("element-list-header")}">Element List</div>
            <div class="${genClassName("element-list")}" id="${genClassName("element-list")}">

            </div>
        </div>
    </div>
`;

const elementPanel = createWindow(elementPanelContent, "element-panel", windowPositions.TOP_LEFT, windowSizes.WIDTH_FULL);
elementPanel.style.height = "80px";

var elementList = [
    {
        name: "Example",
        class: "example",
        id: "example",
        targets: [ "color", "background" ],
        color: "background1"
    }
];

function loadElementPanel() {
    const elementListElement = document.getElementById(genClassName("element-list"));
    elementListElement.innerHTML = "";

    for (const element of elementList) {
        var elementsFound = [];
        
        var classElements = document.getElementsByClassName(element.class);
        for (const classElement of classElements) elementsFound.push(classElement);
        var idElement = document.getElementById(element.id);
        if (idElement) elementsFound.push(idElement);

        for (const elementFound of elementsFound) {
            for (const target of element.targets) {
                elementFound.style.setProperty(target, "var(--" + element.color + ")");
            }
        }
    }

    for (const element of elementList) {
        const elementElement = document.createElement("div");
        elementElement.classList.add(genClassName("element-list-item"));
        elementElement.innerHTML = `
            <div class="${genClassName("element-list-item-name")}">${element.name}</div>
            <div class="${genClassName("element-list-item-class")}">${element.class}</div>
            <div class="${genClassName("element-list-item-id")}">${element.id}</div>
            <div class="${genClassName("element-list-item-color")}">${element.color}</div>
        `;
        elementListElement.appendChild(elementElement);
    }
}

function loadElementPanelListeners() {
    document.getElementById(genClassName("add-element-button")).addEventListener("click", () => {
        const name = document.getElementById(genClassName("add-element-input-name")).value;
        const class_ = document.getElementById(genClassName("add-element-input-class")).value;
        const id = document.getElementById(genClassName("add-element-input-id")).value;
        const targets = document.getElementById(genClassName("add-element-input-targets")).value.split(",");
        const color = document.getElementById(genClassName("add-element-input-color")).value;
        
        elementList.push({
            name: name,
            class: class_,
            id: id,
            targets: targets.map((target) => target.trim()),
            color: color
        });


        console.log(elementList);

        loadElementPanel();
    });
}
////////////// Element Panel End //////////////

////////////// Load //////////////
window.addEventListener("load", () => {
    document.body.appendChild(colorPanel);
    loadColorPanel();

    document.body.appendChild(elementPanel);
    loadElementPanel();

    loadColorPanelListeners();
    loadElementPanelListeners();
});
////////////// Load End //////////////

