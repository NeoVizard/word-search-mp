const fs = require('fs');


let f = fs.readFileSync('words_dictionary.json');
let words_dictionary = JSON.parse(f);

function check_words(words) {
    let res = {}
    for (const i in words) {
        const word = words[i];
        res[word] = word.toLowerCase() in words_dictionary;
    }
    return res;
}

module.exports = check_words;