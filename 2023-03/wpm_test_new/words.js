var word_list = [
	"the", "of", "if", "can", "also", 
	"and", "to", "in", "is", "you", 
	"that", "it", "for", "was", "on", 
	"are", "as", "with", "his", "they", 
	"be", "at", "one", "have", "this", 
	"from", "or", "had", "by", "hot", 
	"nation", "but", "some", "what", "there", 
	"we", "out", "other", "were", "all", 
	"when", "up", "use", "your", "how", 
	"said", "an", "each", "she", "which", 
	"do", "their", "time", "will", "way", 
	"about", "many", "then", "them", "write", 
	"would", "like", "could", "should", "might", 
	"must", "shall", "may", "has", "before", 
	"after", "during", "under", "over", "into", 
	"out of", "through", "without", "within", "around", 
	"among", "between", "besides", "first", "second", 
	"third", "fourth", "fifth", "last", "next", 
	"previous", "new", "old", "big", "small", 
	"good", "bad", "happy", "sad", "angry", 
	"excited", "tired", "surprised", "interested", "bored", 
	"funny", "serious", "strange", "cold", "school", 
	"home", "work", "store", "park", "library", 
	"house", "car", "bus", "train", "plane", 
	"boat", "announce", "loud", "quiet", "fast", 
	"slow", "stop", "go", "run", "walk", 
	"jump", "sit", "stand", "lie", "sleep", 
	"wake", "eat", "drink", "read", "listen", 
	"watch", "look", "see", "hear", "feel", 
	"touch", "smell", "taste", "know", "build", 
	"built", "building", "care", "cared", "lost", 
	"love", "live", "person", "people", "place", 
	"play", "put", "right", "room", "seem", 
	"show", "start", "state", "story", "study", 
	"such", "take", "talk", "tell", "think", 
	"try", "turn", "understand", "want", "well", 
	"year", "a", "above", "across"
];

function check_word_dupes() {
    var dupeList = [];
    for (var i = 0; i < word_list.length; i++) {
        var word = word_list[i];
        if (dupeList.includes(word)) {
            console.log("Duplicate word: " + word);
        } else {
            dupeList.push(word);
        }
    }

    if (dupeList.length == word_list.length) return;

    word_list = dupeList;
    var output = "var word_list = [\n\t";
    for (var i = 0; i < word_list.length; i++) {
        output += "\"" + word_list[i] + "\"";
        if (i != word_list.length - 1) output += ", ";
        if (i % 5 == 4) output += "\n\t";
    }

    output += "\n];";
    console.log(output);
}

check_word_dupes();

const punctuation = [".", ",", "!", "?", ";", ":"];
const pairs = [
    ["(", ")"],
    ["\"", "\""],
    ["'", "'"]
];

function gen_sentence(words, grammar = false) {
    if (grammar) return gen_grammar_sentence(words);
    var sentence = "";
    for (var i = 0; i < words; i++) {
        var word = word_list[Math.floor(Math.random() * word_list.length)];
        sentence += word + (i == words - 1 ? "" : " ");
    }
    return sentence;
}

function gen_grammar_sentence(words) {
    var sentence = "";
    var curPair = null;
    var capatalizeNext = false;

    for (var i = 0; i < words; i++) {
        var word = word_list[Math.floor(Math.random() * word_list.length)];
        var closeCurPair = false;

        if (curPair === null) {
            if (chance(0.2)) {
                curPair = pairs[Math.floor(Math.random() * pairs.length)];
                sentence += curPair[0];
            }
        }
        if (curPair !== null) {
            if (chance(0.3)) {
                closeCurPair = true;
            }
        }
        
        var punc = punctuation[Math.floor(Math.random() * punctuation.length)];
        var puncChance = 0.1;
        if (curPair !== null) puncChance = 0.05;

        if (capatalizeNext || i == 0) {
            word = word[0].toUpperCase() + word.slice(1);
            capatalizeNext = false;
        }

        if (chance(puncChance)) {
            word += punc;
            capatalizeNext = punc == "." || punc == "!" || punc == "?";
        }

        sentence += word + (closeCurPair == true ? curPair[1] : "") + (i == words - 1 ? "" : " ");
        if (closeCurPair) curPair = null;
    }

    if (curPair != null) sentence += curPair[1];
    return sentence;
}

function chance(percent) {
    return Math.random() < percent;
}
