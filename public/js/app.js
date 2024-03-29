const pregame = document.querySelector('.pregame')
const gamebox = document.querySelector('.gamebox')
const loader = document.querySelector('.loader')
const scoreboard = document.querySelector('.scoreboard')
const timer = document.querySelector('.timer')
const total_score_display = document.querySelector('.total-score')
const pregameList = document.querySelector('.pregame-player-list')
const startGame = document.querySelector('.start-game')
const user_list = document.querySelector('.user-list')
const current_word = document.querySelector('.word')
const error_message = document.querySelector('.error-message')
const add_button = document.querySelector('.add_word')
const reset_button = document.querySelector('.reset_word')
const check_button = document.querySelector('.check_words')
const word_list = document.querySelector('.word_list')
const letters = document.querySelectorAll('.letter_b')
const play_again = document.querySelector('.play-again')
const scoreLists = document.querySelector('.score-lists')
var word_list_data = []
var gameState = 0 // 0 - Pregame, 1 - In-game, 2 - Score
var userListData = []
var res
var gameTime = 10

const userName = sessionStorage.getItem("username");
const roomName = document.location.pathname.substr(6);

socket = io();

// PREGAME
startGame.addEventListener('click', (e) => {
    socket.emit('startGame', roomName);
})

// IN-GAME
// Game timer
// window.setInterval(function () {
//     if (gameState == 1) {
//         gameTime--;
//         timer.innerText = gameTime;
//         if (gameTime == 0) {
//             loadScorePage()
//             gameTime = 10
//         }
//     }
// }, 1000)

// Grid event listener
letters.forEach(l => l.addEventListener('click', (e) => {
    e.target.disabled = true;
    word_val = current_word.value
    const letter = e.target.innerHTML.toUpperCase()
    word_val += letter
    current_word.value = word_val
}));

// Add button event listener
add_button.addEventListener('click', (e) => {
    // Word validation
    if (current_word.value.length < 3) {
        error_message.innerText = "Word must be 3 letters or longer"
        return
    }
    else if (word_list_data.includes(current_word.value)) {
        error_message.innerText = "Word already added to list"
        return
    }

    // Clear any error messages
    error_message.innerText = ""

    // Create li
    const li = document.createElement('li')
    li.classList.add('word_in_list')
    word_list_data.push(current_word.value)
    li.innerHTML = current_word.value

    // Create delete button
    const delete_img = document.createElement('img')
    delete_img.src = '/x-circle.svg'
    delete_img.className = 'delete_word'
    li.appendChild(delete_img)

    // word_list.appendChild(li)
    if (word_list.firstChild != null)
        word_list.firstChild.before(li)
    else
        word_list.appendChild(li)

    reset_word()
})

// Reset button event listener
reset_button.addEventListener('click', (e) => {
    reset_word()
})

// Delete button event listener
word_list.addEventListener('click', (e) => {
    if (e.target.className = 'delete_word') {
        li = e.target.parentElement
        if (confirm('Do you want to remove "' + li.innerText + '"?')) {
            word_list_data = word_list_data.filter(v => v != li.innerText)
            li.remove()
        }
    }
})

// Submit button event listener
check_button.addEventListener('click', (e) => {
    loadScorePage();
})

// Play Again button event listener
play_again.addEventListener('click', (e) => {
    socket.emit('playAgain', roomName);
})

// SOCKET STUFF
// Join the room
socket.emit('joinRoom', { roomName, userName });

// Get user list
socket.on('users', (users) => {
    userListData = users;
    makeUserList(users);
    
    if (userListData.filter(u => u.name == userName).length > 0 && !userListData.filter(u => u.name == userName)[0].leader) {
        play_again.disabled = true;
    }
});

// Score update
socket.on('scoreUpdate', (wordDicts) => {
    update_scoreboard(wordDicts);
    showScores();
});

// Game start
socket.on('startGame', () => {
    reset_word();
    gotoGamePage();
});

// Get letters
socket.on('letters', (roomLetters) => {
    letters.forEach(l => {
        l.innerHTML = roomLetters[parseInt(l.id)];
    })
});

// Refresh room to play again
socket.on('reloadRoom', () => {
    console.log("here!");
    word_list.innerHTML = '';
    word_list_data = [];
    gotoPregame();
});

// Generate userlist
function makeUserList(users) {
    let listHTML = ''
    if (users != null) {
        listHTML = `
            ${users.map(user => `<li> ${user.name} ${user.leader ? "👑" : ""} </li>`).join('')}
        `;
    }

    if (gameState == 0) {
        pregameList.innerHTML = listHTML;
    }
    else if (gameState == 1) {
        user_list.innerHTML = listHTML;
    }
}

// Function to clear current word and reset the grid
function reset_word() {
    current_word.value = ""
    letters.forEach(l => l.disabled = false)
}

// Goto preagame
function gotoPregame() {
    scoreboard.classList.add('invis')
    pregame.classList.remove('invis')
}

// Goto game page
function gotoGamePage() {
    pregame.classList.add('invis')
    gamebox.classList.remove('invis')
    gameState = 1
    makeUserList(userListData)
}

// Goto score page
function loadScorePage() {
    gamebox.classList.add('invis')
    loader.classList.remove('invis')
    gameState = 2
    socket.emit('submit', word_list_data)
}

// Ends loader to reveal scores
function showScores() {
    loader.classList.add('invis')
    scoreboard.classList.remove('invis')
}

// Updates the scoreboard
function update_scoreboard(userWordDicts) {
    scoreLists.innerHTML = '';
    Object.keys(userWordDicts).forEach(k => {
        var wordDict = userWordDicts[k];
        var userName = document.createElement('h3');
        var score_list = document.createElement('ul');
        var container = document.createElement('div');

        good_words = Object.keys(wordDict).filter(word => wordDict[word] == true)
        bad_words = Object.keys(wordDict).filter(word => wordDict[word] == false)
        total_score = 0

        good_words.sort(function (a, b) {
            return b.length - a.length || // sort by length, if equal then
                a.localeCompare(b);    // sort by dictionary order
        })

        bad_words.sort(function (a, b) {
            return a.length - b.length || // sort by length, if equal then
                a.localeCompare(b);    // sort by dictionary order
        })

        good_words.forEach(w => {
            li = document.createElement('li')
            li.classList.add('green')
            li.innerText = w

            span = document.createElement('span')
            span.classList.add('right-float')
            span.innerText = "+" + w.length
            total_score += w.length

            li.appendChild(span)
            score_list.appendChild(li)
        })

        bad_words.forEach(w => {
            li = document.createElement('li')
            li.classList.add('red')
            li.innerText = w

            span = document.createElement('span')
            span.classList.add('right-float')
            span.innerText = "-1"
            total_score -= 1

            li.appendChild(span)
            score_list.appendChild(li)
        })

        userName.innerText = k + ": " + total_score;

        container.classList.add('score-contianer');
        score_list.classList.add('score-list');
        container.appendChild(userName);
        container.appendChild(score_list);

        scoreLists.appendChild(container);
    })
}