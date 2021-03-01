const fs = require('fs');


let f = fs.readFileSync('words_dictionary.json');
let words_dictionary = JSON.parse(f);

function checkWords(words) {
    let res = {}
    for (const i in words) {
        const word = words[i];
        res[word] = word.toLowerCase() in words_dictionary;
    }
    return res;
}

function getLetters() {
    let letterGrid = new Array(9);
    for (let i = 0; i < 9; i++) {
        letterGrid[i] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return letterGrid
}

module.exports = { checkWords, getLetters }