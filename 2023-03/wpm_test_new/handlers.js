/**
 * @param {KeyboardEvent} e
 */
function handle_keypress(e) {
    if (wpm_test.test_config.start == null) {
        wpm_test.test_config.start = Date.now();
        if (sim_on_start !== null) {
            simulate_wpm(sim_on_start);
            sim_on_start = null;
        }
    }

    var key = e.key;

    var isValidKey = (
        (!e.metaKey && !e.ctrlKey && !e.altKey) &&
        (key == "Backspace" || key == " " ||
        key.length == 1)
    );

    if (!isValidKey) return;

    switch (key) {
        case "Backspace":
            if (wpm_test.cursor_index > 0) {
                wpm_test.cursor_index--;
                wpm_test.text_elms[wpm_test.cursor_index].removeClass("correct");
                wpm_test.text_elms[wpm_test.cursor_index].removeClass("incorrect");
                wpm_test.user_text = wpm_test.user_text.substring(0, wpm_test.user_text.length - 1);
            }
            break;
        
        default:
            e.preventDefault();
            if (wpm_test.text[wpm_test.cursor_index] == key) {
                wpm_test.text_elms[wpm_test.cursor_index].addClass("correct");
                wpm_test.user_text += key;
                wpm_test.cursor_index++;
                break;
            }

            wpm_test.text_elms[wpm_test.cursor_index].addClass("incorrect");
            wpm_test.user_text += key;

            if (!wpm_test.mistakes.find(m => m.index == wpm_test.cursor_index)) {
                wpm_test.mistakes.push({
                    index: wpm_test.cursor_index,
                    char: key
                });
            }

            wpm_test.cursor_index++;
            break;
    }

    var curElm = wpm_test.text_elms[wpm_test.cursor_index];
    if (curElm) {
        $("#cursor").css("top", curElm.parent().offset().top - $("#wpm-test").offset().top);
        $("#cursor").css("left", curElm.offset().left - $("#wpm-test").offset().left);
    }

    // Get cur word index
    var userWords = wpm_test.user_text.split(" ");
    var curWordIndex = userWords.length - 1;
    $("#words-view").text((curWordIndex + 1) + " / " + wpm_test.test_config.wordCount);

    if (wpm_test.cursor_index >= wpm_test.text_elms.length - 1) {
        end_test();
    }
}

document.addEventListener('keydown', (e) => {
    if (!$("#wpm-test").is(":focus")) return;
    if (e.key == "Tab") {
        e.preventDefault();
        $("#wpm-test-restart").trigger("focus");
        return;
    }
    if (!wpm_test.test_active) return;
    handle_keypress(e);
});

var sim_lock = null;
function simulate_wpm(wpm) {
    var cursor = $("#cursor-sim");
    var sentenceLength = wpm_test.text.length;
    var time = (sentenceLength / 5) / (wpm / 60000);
    var timePerChar = time / sentenceLength;
    var curChar = 0;
    if (sim_lock !== null) clearInterval(sim_lock);
    function inc_this() {
        if (curChar >= sentenceLength + 1) return;
        // handle_keypress({
        //     key: wpm_test.text[curChar],
        //     preventDefault: () => {}
        // });
        cursor.css("top", wpm_test.text_elms[curChar].parent().offset().top - $("#wpm-test").offset().top);
        cursor.css("left", wpm_test.text_elms[curChar].offset().left - $("#wpm-test").offset().left);
        curChar++;
    }

    inc_this();

    sim_lock = setInterval(() => {
        inc_this();
    }, timePerChar);
}

function repeat_test() {
    var wpm = calculate_test_results().wpm;
    wpm_test.test_active = false;
    wpm_test.test_config.start = null;
    wpm_test.test_config.user_text = "";
    wpm_test.test_config.mistakes = [];
    for (var i = 0; i < wpm_test.text_elms.length; i++) {
        wpm_test.text_elms[i].removeClass("correct");
        wpm_test.text_elms[i].removeClass("incorrect");
    }
    wpm_test.cursor_index = 0;

    $("#cursor").css("top", wpm_test.text_elms[0].offset().top - $("#wpm-test").offset().top);
    $("#cursor").css("left", wpm_test.text_elms[0].offset().left - $("#wpm-test").offset().left);

    start_test();
    sim_on_start = wpm;
}

function end_test() {
    wpm_test.test_active = false;
    wpm_test.test_config.end = Date.now();

    $("#wpm-test").trigger("blur");
    $("#wpm-test-result").removeClass("hidden");

    var results = calculate_test_results();
    console.log(results);
    var wpm = Math.round(results.wpm);
    $("#wpm-test-result-wpm").text(wpm);
    $("#wpm-test-result-cpm").text(wpm * 5);

    var accuracy = results.accuracy;
    $("#wpm-test-result-acc").text(accuracy);
}
