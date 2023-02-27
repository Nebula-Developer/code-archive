const { ipcRenderer } = require('electron');
const fs = require('fs');
const $ = require('jquery');

function folderSelect() {
    return new Promise(async (resolve, reject) => {
        ipcRenderer.send('folder-select');
    });
}

var fileBrowserContent = $("#file-browser-content");
var fileBrowserTitle = $("#file-browser-title");
navigateFolder(process.cwd());

ipcRenderer.on('folder-select-reply', (event, arg) => {
    navigateFolder(arg[0]);
});

function navigateFolder(folder) {
    folder = folder.replace(/\\/g, "/");
    fileBrowserContent.empty();
    var files = fs.readdirSync(folder);
    files.forEach(file => {
        var fileIcon = "fa-file";
        var codeExt = [ "c", "cpp", "cs", "css", "html", "java", "js", "json", "php", "py", "rb", "sh", "swift", "ts", "xml", "yml" ];
        var codeExt2 = [ "bat", "cmd", "go", "h", "hpp", "lua", "pl", "ps1", "rs", "sass", "scss", "sql", "vb", "vim", "xaml" ];

        if (file.includes(".")) {
            var ext = file.split(".").pop();
            if (codeExt.includes(ext)) {
                fileIcon = "fa-file-code";
            } else if (codeExt2.includes(ext)) {
                fileIcon = "fa-file-alt";
            } else if (ext == "exe") {
                fileIcon = "fa-file-excel";
            }
        }

        var isFolder = fs.statSync(folder + "/" + file).isDirectory();
        if (isFolder) {
            fileIcon = "fa-folder";
        }

        fileBrowserContent.append(`
        <div class="file-browser-file">
            <div class="file-browser-file-icon">
                <i class="fas ${fileIcon}"></i>
            </div>
            <div class="file-browser-file-name">
                ${file}
            </div>
        </div>
        `);
    });

    fileBrowserTitle.text(folder.split("/").pop());
}

var editorLineNumbers = $("#editor-line-numbers");
var editorLines = $("#editor-lines");
var editorCarret = $("#editor-carret");

var x = 0, y = 0;

var selectXStart = -1, selectYStart = -1;
var selectXEnd = -1, selectYEnd = -1;

var lines = [
    "Hello World!",
    "This is a test",
    "How are you doing?"
];

var elementLines = [ ];

var endYReal = Math.max(selectYStart, selectYEnd);
var startYReal = Math.min(selectYStart, selectYEnd);
var endXReal = Math.max(selectXStart, selectXEnd);
var startXReal = Math.min(selectXStart, selectXEnd);

function refreshRealPositions() {
    endYReal = Math.max(selectYStart, selectYEnd);
    startYReal = Math.min(selectYStart, selectYEnd);
    endXReal = Math.max(selectXStart, selectXEnd);
    startXReal = Math.min(selectXStart, selectXEnd);
}

function isCharSelected(x, y) {
    if (y < startYReal || y > endYReal) return false;
    if (selectXStart == 0 && x == 0 && y == selectYStart) {
        if (selectYStart < selectYEnd) return true;
        else return false;
    }

    if (y == startYReal && y == endYReal) {
        return x >= startXReal + 1 && x <= endXReal;
    }
    
    if (y == endYReal) {
        var isStartBeforeEnd = selectYStart < selectYEnd;
        if (isStartBeforeEnd) return x <= selectXEnd;
        else if (x <= selectXStart) return true;
        else return false;
    }
    
    if (y == startYReal) {
        var isStartBeforeEnd = selectYStart < selectYEnd;
        if (isStartBeforeEnd) {
            return x >= selectXStart + 1;
        } else if (x >= selectXEnd + 1) {
            return true;
        }
    } else {
        return true;
    }

    return false;
}

function updateEditorView() {
    editorLineNumbers.empty();
    editorLines.empty();

    var selectedElm = null;
    var selectedLine = null;

    refreshRealPositions();

    for (var i = 0; i < lines.length; i++) {
        editorLineNumbers.append(`<div class="editor-line-number">${i + 1}</div>`);
        var lineArr = [ ];
        var editorLine = $(`<div class="editor-line"></div>`);
        for (var j = 0; j < lines[i].length + 1; j++) {
            var newElm = $(`<div class="editor-char"></div>`)
            if (j != lines[i].length) newElm.text(lines[i][j]);
            else newElm.text(" ");
            if (i == y && j == x) {
                selectedElm = newElm;
            }

            if (isCharSelected(j, i)) {
                newElm.addClass("editor-char-selected");
            }

            editorLine.append(newElm);
            lineArr.push(newElm);
        }

        if (i == y) {
            selectedLine = editorLine;
            if (x > lines[i].length) {
                selectedElm = editorLine.children().last();
                editorLine.append(selectedElm);
            }
        }
        
        editorLines.append(editorLine);
        elementLines.push(lineArr);
    }

    if (selectedElm != null) {
        editorCarret.css("left", selectedElm.offset().left);
        editorCarret.css("top", selectedLine.offset().top);
    }
}

updateEditorView();

var wordReg = new RegExp("[a-zA-Z0-9_]");
var backLock = false;

document.addEventListener("keydown", (e) => {
    var isArrow = e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "ArrowLeft" || e.key == "ArrowRight";
    var previousX = x, previousY = y;

    if (e.key == "ArrowUp") {
        if (y > 0) {
            y--;
        }
    } else if (e.key == "ArrowDown") {
        if (y < lines.length - 1) {
            y++;
        }
    } else if (e.key == "ArrowLeft") {
        if (x > lines[y].length) x = lines[y].length;
        if (x > 0) {
            var oldX = x;
            x--;
            if (e.ctrlKey || e.altKey) {
                if (lines[y][x] == " ") x--;

                var didMove = false;
                while (x > 0 && wordReg.test(lines[y][x])) {
                    x--;
                    didMove = true;
                }
                if (lines[y][x] == " " && didMove) x++;
            }
        } else {
            if (y > 0) {
                y--;
                x = lines[y].length;
            }
        }
    } else if (e.key == "ArrowRight") {
        if (x < lines[y].length) {
            var oldX = x;
            x++;
            if (e.ctrlKey || e.altKey) {
                while (x < lines[y].length && wordReg.test(lines[y][x])) {
                    x++;
                }
            }
        } else {
            if (y < lines.length - 1) {
                y++;
                x = 0;
            }
        }
    } else if (e.key == "Enter") {
        lines.splice(y + 1, 0, "");
        if (x < lines[y].length) {
            lines[y + 1] = lines[y].slice(x);
            lines[y] = lines[y].slice(0, x);
        }
        y++;
        x = 0;
    } else if (e.key == "Backspace") {
        if (x > lines[y].length) x = lines[y].length;
        if (x > 0) {
            if ((e.ctrlKey || e.altKey) && x > 0) {
                if (lines[y][x - 1] == " ") {
                    backspace();
                }

                var word = "";
                for (var i = x - 1; i >= 0; i--) {
                    if (!wordReg.test(lines[y][i])) break;
                    word = lines[y][i] + word;
                }

                lines[y] = lines[y].slice(0, x - word.length) + lines[y].slice(x);
                x -= word.length;

                if (word.length == 0) {
                    backspace();
                }
            } else {
                lines[y] = lines[y].slice(0, x - 1) + lines[y].slice(x);
                x--;
            }
        } else if (y > 0) {
            x = lines[y - 1].length;
            lines[y - 1] += lines[y];
            lines.splice(y, 1);
            y--;
        }
    } else if (e.key.length == 1) {
        if (x >= lines[y].length) {
            lines[y] += e.key;
        }
        else lines[y] = lines[y].slice(0, x) + e.key + lines[y].slice(x);
        x++;
    }

    if (e.shiftKey && isArrow) {
        if (selectXStart == -1) {
            selectXStart = previousX - 1 == -1 ? 0 : previousX - 1;
            selectYStart = previousY;
        }
        selectXEnd = x - 1;
        selectYEnd = y;
    } else {
        selectXStart = -1;
        selectYStart = -1;
        selectXEnd = -1;
        selectYEnd = -1;
    }
    

    updateEditorView();
});

function backspace() {
    if (x > 0) {
        x--;
        lines[y] = lines[y].slice(0, x) + lines[y].slice(x + 1);
    } else if (y > 0) {
        x = lines[y - 1].length;
        lines[y - 1] += lines[y];
        lines.splice(y, 1);
        y--;
    }
}
