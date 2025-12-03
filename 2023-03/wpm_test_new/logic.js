function calculate_test_accuracy() {
    var mistakes = wpm_test.mistakes.length;
    var sentenceLength = wpm_test.text.length;
    var accuracy = (sentenceLength - mistakes) / sentenceLength;
    return accuracy;
}
