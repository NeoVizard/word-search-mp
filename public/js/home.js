const room_name = document.querySelector('#roomName');
const user_name = document.querySelector('#userName');
const name_modal = document.querySelector('#nameModal');
const display_name = document.querySelector('#displayName');
const save_name = document.querySelector('#saveName');
const create_room = document.querySelector('#createRoom');
// const join_room = document.querySelector('.join-room');
var guest_name;
var userName;

userName = localStorage.getItem('userName');

if (userName == null) {
    var modal = new bootstrap.Modal(name_modal);
    modal.show();
}
else {
    display_name.innerHTML = userName;
}

save_name.addEventListener('click', (e) => {
    userName = user_name.value;
    localStorage.setItem('userName', userName);
    display_name.innerHTML = userName;
});

create_room.addEventListener('click', (e) => {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.location.pathname = '/room/' + room_name.value
        }
    }
    xhttp.open('POST', '/room');
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send( `{"roomName": "${room_name.value}"}` );
});
