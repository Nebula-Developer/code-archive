showWelcome();
initLearnPlus();

async function initLearnPlus() {
    var overlayHTML = await getFile('overlay.html');
    var overlayCSS = await getFile('overlay.css');
    var templateCSS = await getFile('template.css');

    if (overlayCSS === false || overlayHTML === false || templateCSS === false) {
        logMsg("Failed to load server files.");
        return;
    }

    var learnplusDiv = document.createElement('div');
    learnplusDiv.id = 'learnplus-wrapper';
    learnplusDiv.className = 'lp-z-index-1 lp-relative-pos';

    var learnplusCSS = document.createElement('style');
    learnplusCSS.innerHTML = overlayCSS + '\n' + templateCSS + '\n';

    var learnplusHTML = document.createElement('div');
    learnplusHTML.innerHTML = overlayHTML;
    
    learnplusDiv.appendChild(learnplusCSS);
    learnplusDiv.appendChild(learnplusHTML);
    document.body.appendChild(learnplusDiv);

    initElements();
}
