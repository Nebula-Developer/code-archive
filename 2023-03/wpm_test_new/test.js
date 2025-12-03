const wpm_test_types = {
    "words": 0,
    "time": 1
}

const wpm_test_base = {
    cursor_index: 0,
    text: "",
    user_text: "",
    text_elms: [],
    test_active: false,

    test_mode: "words",
    test_config: {
        wordCount: 10,
        time: 10000,
        start: 0,
        end: 0
    },

    mistakes: []
};

var wpm_test = structuredClone(wpm_test_base);
var sim_on_start = 100;

function create_test(text) {
    wpm_test = structuredClone(wpm_test_base);
    wpm_test.text = text;

    var test = $("#wpm-test");
    test.empty();
    test.append("<div id='cursor'></div>");
    test.append("<div id='cursor-sim'></div>");

    var words = text.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = create_word(words[i]);
        test.append(word.element);

        wpm_test.text_elms.push(...word.letters);
        
        var space = $("<div class='space'></div>");
        word.element.append(space);
        wpm_test.text_elms.push(space);
    }

    wpm_test.cursor_index = 0;
}

function create_word(word) {
    var word_elm = $("<div class='word'></div>");
    var word_letters = [];
    for (var i = 0; i < word.length; i++) {
        var letter = $("<div class='letter'></div>");
        if (i < 3) letter.addClass("bold-letter");
        letter.text(word[i]);
        word_elm.append(letter);
        word_letters.push(letter);
    }

    return {
        element: word_elm,
        letters: word_letters
    };
}

function calculate_test_results() {
    if (wpm_test.test_mode == "words") {
        return calculate_words_results();
    } else if (wpm_test.test_mode == "time") {
        return calculate_time_results();
    }
}

function calculate_words_results() {
    var time = wpm_test.test_config.end - wpm_test.test_config.start;
    var sentenceLength = wpm_test.text.length - wpm_test.mistakes.length;
    var cpm = sentenceLength / (time / 60000);
    var wpm = cpm / 5;

    var accuracy = (wpm_test.text.length - wpm_test.mistakes.length) / wpm_test.text.length * 100;
    var accuracy = Math.round(accuracy * 100) / 100;

    return {
        wpm: wpm,
        cpm: cpm,
        accuracy: accuracy
    };
}

function calculate_time_results() {
    var time = wpm_test.test_config.end - wpm_test.test_config.start;
    var sentenceLength = wpm_test.text.length - wpm_test.mistakes.length;
    var wpm = (sentenceLength / 5) / (time / 60000);

    var chars = wpm_test.text.length;
    var cpm = chars / (time / 60000);

    var accuracy = (wpm_test.text.length - wpm_test.mistakes.length) / wpm_test.text.length * 100;
    var accuracy = Math.round(accuracy * 100) / 100;

    return {
        wpm: wpm,
        cpm: cpm,
        accuracy: accuracy
    };
}

function start_test() {
    wpm_test.test_active = true;
    wpm_test.test_config.start = null;
}

function reset_test() {
    if (sim_lock != null) clearInterval(sim_lock);
    $("#words-view").text("0 / " + wpm_test.test_config.wordCount);
    create_test(gen_sentence(wpm_test.test_config.wordCount));
    start_test();
    $("#wpm-test").trigger("focus");
    $("#wpm-test-result").addClass("hidden");
}
