const gamebox = document.querySelector('.gamebox')
const scoreboard = document.querySelector('.scoreboard')
const total_score_display = document.querySelector('.total-score')
const user_list = document.querySelector('.user-list')
const current_word = document.querySelector('.word')
const error_message = document.querySelector('.error-message')
const add_button = document.querySelector('.add_word')
const reset_button = document.querySelector('.reset_word')
const check_button = document.querySelector('.check_words')
const word_list = document.querySelector('.word_list')
const letters = document.querySelectorAll('.letter_b')
const play_again = document.querySelector('.play-again')
var word_list_data = []
var res

const userName = sessionStorage.getItem("username");
const roomName = document.location.pathname.substr(6);

socket = io();

// Get letters for grid
var xhttp = new XMLHttpRequest()
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        res = JSON.parse(this.responseText)["letters"]
        letters.forEach(l => {
            l.innerHTML = res[parseInt(l.id)]
        })
    }
}
xhttp.open('GET', 'https://boggle.neovizard.repl.co/letters')
xhttp.send()

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
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            res = JSON.parse(this.responseText)
            generate_score(res)
        }
    }
    xhttp.open('POST', '/words')
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send(JSON.stringify(word_list_data));
})

// Play Again button event listener
play_again.addEventListener('click', (e) => {
    // Reload page
    document.location.reload()
})

// SOCKET STUFF
// Join the room
socket.emit('joinRoom', { roomName, userName });

// Get user list
socket.on('users', (users) => {
    if (users != null) {
        user_list.innerHTML = `
            ${users.map(user => `<li> ${user} </li>`).join('')}
        `;
    }
})

// Function to clear current word and reset the grid
function reset_word() {
    current_word.value = ""
    letters.forEach(l => l.disabled = false)
}

// Function to calculate score and display it
function generate_score(word_dict) {
    var words_in_list = document.querySelectorAll('li.word_in_list')
    var score_list = document.querySelector('.score-dist')
    gamebox.classList.add('invis')
    scoreboard.classList.remove('invis')

    good_words = []
    bad_words = []
    total_score = 0

    words_in_list.forEach(li => {
        w = li.innerText
        if (word_dict[w]) {
            good_words.push(w)
        }
        else {
            bad_words.push(w)
        }
    })

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

    total_score_display.innerText = "Your score: " + total_score
}