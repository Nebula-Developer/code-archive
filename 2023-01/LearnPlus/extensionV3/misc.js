function showWelcome() {
    var loadMsgs = [
        "%c╔════════════════════════════════════╗",
        "║                                    ║",
        "║        Welcome to LearnPlus.       ║",
        "║           NebulaDev - 2023         ║",
        "║     %cgithub.com/nebula-developer%c    ║",
        "║                                    ║",
        "╚════════════════════════════════════╝"
    ];
    
    var welcomeLogCSS = "color: #572680; font-size: 14px; font-family: courier;";
    var gitLinkCSS = "color: #264a80; font-size: 14px; font-family: courier;";

    console.log(loadMsgs.join("\n"), welcomeLogCSS, gitLinkCSS, welcomeLogCSS);
}

function logMsg(msg) {
    console.log("%c[ LearnPlus ] %c" + msg, "color: #572680; font-size: 12px; font-family: courier;", "color: #264a80; font-size: 12px; font-family: courier;");
}

function getFile(fileName, alwaysResolve = true) {
    return new Promise((resolve, reject) => {
        socket.emit('getFile', fileName, (res) => {
            if (res.success) resolve(res.data);
            else if (alwaysResolve) resolve(false);
            else reject(res.error);
        });
    });
}