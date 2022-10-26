var typeTest = {
    words: 10,
    testActive: true,
    sentence: '',
    typed: '',
    typeIndex: 0,
    curWord: 0,
    startTime: 0,
    endTime: 0,
    time: 0,
    started: false,
    wrong: 0
};

const caret = '<div id="caret"></div>';

const words = [
    'in',
    'for',
    'if',
    'to',
    'on',
    'else',
    'while',
    'another',
    'count',
    'placement',
    'nation',
    'government',
    'hold',
    'person',
    'because',
    'they',
    'which',
    'without',
    'more',
    'most',
    'making',
    'bank'
];

function createChar(ch) {
    var char = document.createElement('div');
    char.classList.add('letter');

    if (ch == ' ') {
        char.classList.add('space');
    } else {
        char.textContent = ch;
    }

    return char;
}

function genTest() {
    document.getElementById('type-content').innerHTML = caret; // Fill with only caret

    for (var i = 0; i < typeTest.words; i++) {
        var wordDiv = document.createElement('div');
        wordDiv.classList.add('word');

        var word = words[Math.floor(Math.random() * words.length)];

        for (var ch of word) {
            wordDiv.appendChild(createChar(ch));
        }

        if (i < typeTest.words - 1) {
            var space = createChar(' ');
            wordDiv.appendChild(space);
        }

        document.getElementById('type-content').appendChild(wordDiv);

        typeTest.sentence += word + (i < typeTest.words - 1 ? ' ' : '');
    }
}

startTest();

function getLetter(index) {
    // Find the letter elm in the sentence
    var letterInSentence = typeTest.sentence[index];

    // Count the number of spaces before the letter
    var spaces = 0;
    for (var i = 0; i < index; i++) if (typeTest.sentence[i] == ' ') spaces++;

    // Find the word elm in the sentence
    var wordInSentence = document.getElementById('type-content').children[spaces + 1]; // +1 To avoid caret

    // Get the text in sentence before the word
    var textBeforeWord = typeTest.sentence.substring(0, index);
    textBeforeWord = textBeforeWord.substring(0, textBeforeWord.lastIndexOf(' '));

    // I don't know why this works :P probs cuz no space at first word last index so we just sub 1 if more than 1 space
    var wordIndex = index - textBeforeWord.length - (spaces != 0 ? 1 : 0);
    return wordInSentence.children[wordIndex];
}

function moveCaret() {
    var caret = document.getElementById('caret');

    if (typeTest.typeIndex >= typeTest.sentence.length) {
        // End of sentence
        var lastWord = document.getElementById('type-content').children[typeTest.words];
        caret.style.left = lastWord.offsetLeft + lastWord.offsetWidth + 'px';
        caret.style.top = lastWord.offsetTop + 'px';
    } else {
        var letter = getLetter(typeTest.typeIndex);
        caret.style.left = letter.offsetLeft + 'px';
        caret.style.top = letter.offsetTop + 'px';
    }
}

function startTest() {
    typeTest = {
        words: typeTest.words,
        testActive: true,
        sentence: '',
        typed: '',
        typeIndex: 0,
        curWord: 0,
        startTime: 0,
        endTime: 0,
        time: 0,
        started: false,
        wrong: 0
    };

    genTest();
    moveCaret();
    document.getElementById("content-section").classList.remove('test-inactive');
    document.getElementById("type-wrapper").classList.remove('timer-start');
}

function startTimer() {
    typeTest.startTime = Date.now();
    typeTest.started = true;

    document.getElementById("type-wrapper").classList.add('timer-start');
}

function endTest() {
    typeTest.testActive = false;
    typeTest.endTime = Date.now();
    typeTest.time = typeTest.endTime - typeTest.startTime;
    typeTest.started = false;

    var wpm = Math.round(typeTest.words / (typeTest.time / 1000 / 60));

    var wpmBasedOnLength = Math.round(typeTest.sentence.length / 5 / (typeTest.time / 1000 / 60));
    
    // If there are 4 chars and 2 wrong, then 2/4 = 0.5, 1 - 0.5 = 0.5, 0.5 * 100 = 50
    var accuracy = Math.round((1 - typeTest.wrong / typeTest.sentence.length) * 100);
    accuracy = accuracy < 0 ? 0 : accuracy;

    if (typeTest.wrong > typeTest.sentence.length)
        accuracy = "N/A";

    document.getElementById('wpm').textContent = wpm;
    document.getElementById('rwpm').textContent = wpmBasedOnLength;
    document.getElementById('accuracy').textContent = accuracy;
    document.getElementById('time').textContent = typeTest.time / 1000;

    document.getElementById("content-section").classList.add('test-inactive');
    document.getElementById("type-wrapper").classList.remove('timer-start');
}

document.onkeydown = function(e) {
    if (e.key == 'g' && e.ctrlKey) {
        startTest();
        return false;
    }

    if (!typeTest.testActive) {
        return;
    }

    if (!typeTest.started) {
        startTimer();
    }
    
    var key = e.key;
    
    var isChar = (e.key.length == 1 && e.key.match(/[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/));
    
    if (typeTest.typeIndex >= typeTest.sentence.length) {
        endTest();
        return false;
    }

    // Make sure nothing is selected
    if (window.getSelection) {
        // If it is an input or textarea, then we don't want to do anything
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') return;
    }

    var prevTopOffset = getLetter(typeTest.typeIndex).offsetTop;

    if (isChar) {
        typeTest.typed += key;
        typeTest.typeIndex++;
        var letter = getLetter(typeTest.typeIndex - 1);

        if (typeTest.typed[typeTest.typeIndex - 1] == typeTest.sentence[typeTest.typeIndex - 1]) {
            letter.classList.add('typed');
        }
        else {
            letter.classList.add('wrong');
            typeTest.wrong++;
        }
    }

    if (key == 'Backspace' && typeTest.typeIndex > 0) {
        typeTest.typeIndex--;
        var letter = getLetter(typeTest.typeIndex);
        letter.classList.remove('typed');
        letter.classList.remove('wrong');
        typeTest.typed = typeTest.typed.substring(0, typeTest.typed.length - 1);
    }

    moveCaret();

    if (typeTest.typeIndex >= typeTest.sentence.length) {
        endTest();
        return false;
    }

    var newTopOffset = getLetter(typeTest.typeIndex).offsetTop;
    
    // Scroll if needed
    if (newTopOffset != prevTopOffset) {
        document.getElementById('type-content').scrollTop += newTopOffset - prevTopOffset;
    }
}

function isLetter(key) {
    return key.length === 1;
}

document.getElementById("restart-button").addEventListener("click", function() {
    startTest();
    // Unfocus
    document.getElementById("restart-button").blur();
});

var tCount = 0;

document.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        document.getElementById('restart-button').focus();
    }
});

document.getElementById("words").addEventListener("change", function() {
    var val = this.value;
    if (isNaN(val) || val <= 0) return;
    typeTest.words = val;
    startTest();
});