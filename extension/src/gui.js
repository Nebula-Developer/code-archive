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
        document.getElementById(genClassName("color-" + item.variable + "-input")).addEventListener("input", (e) => {
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
    <div class="${genClassName("flex-column")} ${genClassName("element-panel-content")}">
        <div class="${genClassName("add-element-wrapper")}">
            <div class="${genClassName("add-element-header")}">Add Element</div>
            <div class="${genClassName("add-element-input-wrapper")}">
                <button id="${genClassName("add-element-input-picker")}">Pick &#128269;</button>

                <input type="text" id="${genClassName("add-element-input-name")}" placeholder="Element Name">
                <input type="text" id="${genClassName("add-element-input-query")}" placeholder="Element Query">
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

const elementPanel = createWindow(elementPanelContent, "element-panel", windowPositions.TOP_LEFT, windowSizes.HEIGHT_FULL);
elementPanel.style.width = "200px";
elementPanel.style.height = "calc(100% - 80px)";

var elementList = [
    {
        name: "Example",
        query: ".example",
        targets: [ "color", "background" ],
        color: "background1"
    }
];

function loadElementPanel() {
    const elementListElement = document.getElementById(genClassName("element-list"));
    elementListElement.innerHTML = "";

    for (const element of elementList) {
        var elementsFound = document.querySelectorAll(element.query);

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
            <div class="${genClassName("element-list-item-query")}">${element.query}</div>
            <div class="${genClassName("element-list-item-color")}">${element.color}</div>
        `;
        elementListElement.appendChild(elementElement);
    }
}

function loadElementPanelListeners() {
    document.getElementById(genClassName("add-element-button")).addEventListener("click", () => {
        const name = document.getElementById(genClassName("add-element-input-name")).value;
        const query = document.getElementById(genClassName("add-element-input-query")).value;
        const targets = document.getElementById(genClassName("add-element-input-targets")).value.split(",");
        const color = document.getElementById(genClassName("add-element-input-color")).value;
        
        elementList.push({
            name: name,
            query: query,
            targets: targets.map((target) => target.trim()),
            color: color
        });


        console.log(elementList);

        loadElementPanel();
    });

    var picker = document.getElementById(genClassName("add-element-input-picker"));
    picker.addEventListener("click", () => {
        setTimeout(() => {
            picker.innerHTML = "Picking &#128269;";
            picker.style.backgroundColor = "var(--accent1)";
            picker.style.color = "var(--text1)";
    
            document.addEventListener("click", (e) => {
                picker.innerHTML = "Pick &#128269;";
                picker.style.backgroundColor = "var(--background1)";
                picker.style.color = "var(--text1)";

                var query = e.target.tagName.toLowerCase();
                if (e.target.id)
                    query += "#" + e.target.id;
                if (e.target.className)
                    query += "." + e.target.className.split(" ").join(".");
    
                document.getElementById(genClassName("add-element-input-query")).value = query;

                e.stopPropagation();
                e.preventDefault();
            }, { once: true });
        }, 10);
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

