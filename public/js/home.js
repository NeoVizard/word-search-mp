const welcome_text = document.querySelector('.welcome-text');
const room_name = document.querySelector('.room-name');
const user_name = document.querySelector('.user-name');
const create_room = document.querySelector('.create-room');
const join_room = document.querySelector('.join-room');
var guest_name;

create_guest();

create_room.addEventListener('click', (e) => {
    sessionStorage.setItem("username", user_name.value)

    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.location.pathname = '/room/' + room_name.value
        }
    }
    xhttp.open('POST', '/room')
    xhttp.setRequestHeader("Content-type", "application/json")
    xhttp.send( `{"roomName": "${room_name.value}"}` );

});

join_room.addEventListener('click', (e) => {
    sessionStorage.setItem("username", user_name.value)
    document.location.pathname = '/room/' + room_name.value
});

function create_guest() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            res = this.responseText;
            guest_name = "Guest_" + res.substr(0,8);
            welcome_text.innerHTML = "Welcome " + guest_name;
        }
    };
    xhttp.open('GET', '/user_uuid');
    xhttp.send();
}