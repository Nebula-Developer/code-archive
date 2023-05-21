const privKey = "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";

// call:
// curl https://api.openai.com/v1/chat/completions \
//   -H "Content-Type: application/json" \
//   -H "Authorization: Bearer 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" \
//   -d '{
//      "model": "gpt-3.5-turbo",
//      "messages": [{"role": "user", "content": "Say this is a test!"}]
//    }'

function callGPT(prompt) {
    return new Promise((resolve, reject) => {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + privKey
        }
        const body = {
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": prompt }],
            "max_tokens": 64,
        }

        fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        }).then((response) => {
            response.json().then((data) => {
                resolve(data);
            });
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}

var curKey = null;

async function emulateKeystroke(text) {
    for (var i = 0; i < text.length; i++) {
        while (curKey == null) {
            await new Promise(r => setTimeout(r, 10));
        }

        if (curKey == "Escape") {
            swapHandleA();
            return;
        }

        curKey = null;

        var char = text[i];
        jQuery.event.trigger({
            type: 'keypress',
            which: char.charCodeAt(0)
        });

        var activeElm = document.activeElement;
        if (activeElm.tagName == "INPUT" || activeElm.tagName == "TEXTAREA") {
            activeElm.value += char;
        }
    }

    swapHandleA();
}

/** @type {AddEventListenerOptions} */
const evConfig = {
    passive: false,
    capture: true
};

let handleA;
let handleB;
let handleC;

handleA = (e) => {
    if (e.ctrlKey && e.altKey && e.key === "a") {
        swapHandleB();
    }
}

handleC = (e) => {
    curKey = e.key;
    e.preventDefault();
    e.stopPropagation();
}

function swapHandleA() {
    document.removeEventListener('keydown', handleB, evConfig);
    document.removeEventListener('keydown', handleC, evConfig);
    document.addEventListener('keydown', handleA, evConfig);
    if (document.getElementById("ai-input")) document.getElementById("ai-input").remove();
}

function swapHandleB() {
    document.removeEventListener('keydown', handleA, evConfig);
    document.removeEventListener('keydown', handleC, evConfig);
    document.addEventListener('keydown', handleB, evConfig);
    input = "";
}

function swapHandleC() {
    document.removeEventListener('keydown', handleA, evConfig);
    document.removeEventListener('keydown', handleB, evConfig);
    document.addEventListener('keydown', handleC, evConfig);
    if (document.getElementById("ai-input")) document.getElementById("ai-input").remove();
}

handleB = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const displayIn = () => {
        var el = document.getElementById("ai-input");
        if (!el) {
            el = document.createElement("div");
            el.id = "ai-input";

            const css = `
                position: fixed;
                bottom: 0;
                left: 0;
                color: black;
                text-shadow: 0 0 1px white;
                font-size: 13px;
                padding: 5px;
                z-index: 99999;
                opacity: 0.2;
            `;

            el.style = css;
            document.body.appendChild(el);
        }

        el.innerHTML = input;
    }

    if (e.key === "Escape") { swapHandleA(); return; }

    if (e.key === "Enter") {
        swapHandleC();

        callGPT(input).then((data) => {
            if (data.choices.length == 0 || data.choices[0].message == null) { swapHandleA(); return; }
            const response = data.choices[0].message.content;
            if (response == null || response.length == 0) { swapHandleA(); return; }
            emulateKeystroke(response);
        });

        return;
    }

    if (e.ctrlKey || e.altKey) return;
    if (e.key === "Backspace") { input = input.slice(0, -1); displayIn(); return; }
    if (e.key.length > 1) return;

    input += e.key;
    displayIn();
}

document.addEventListener('keydown', handleA, evConfig);
