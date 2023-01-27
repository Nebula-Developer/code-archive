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
