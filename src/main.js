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
var lines = [
    "Hello World!",
    "This is a test",
    "How are you doing?"
];

function updateEditorView() {
    editorLineNumbers.empty();
    editorLines.empty();

    var selectedElm = null;
    var selectedLine = null;

    for (var i = 0; i < lines.length; i++) {
        editorLineNumbers.append(`<div class="editor-line-number">${i + 1}</div>`);
        var editorLine = $(`<div class="editor-line"></div>`);
        for (var j = 0; j < lines[i].length + 1; j++) {
            var newElm = $(`<div class="editor-char"></div>`)
            if (j != lines[i].length) newElm.text(lines[i][j]);
            else newElm.text(" ");
            if (i == y && j == x) {
                selectedElm = newElm;
            }
            editorLine.append(newElm);
        }

        if (i == y) {
            selectedLine = editorLine;
            if (x > lines[i].length) {
                selectedElm = editorLine.children().last();
                editorLine.append(selectedElm);
            }
        }
        editorLines.append(editorLine);
    }

    if (selectedElm != null) {
        editorCarret.css("left", selectedElm.offset().left);
        editorCarret.css("top", selectedLine.offset().top);
    }
}

updateEditorView();

var aimForX = 0;

document.addEventListener("keydown", (e) => {
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
            x--;
        }
    } else if (e.key == "ArrowRight") {
        if (x < lines[y].length) {
            x++;
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
            lines[y] = lines[y].slice(0, x - 1) + lines[y].slice(x);
            x--;
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

    console.log(x);
    updateEditorView();
});
