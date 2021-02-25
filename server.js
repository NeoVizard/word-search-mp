const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const check_words = require('./game');
const { createRoom, roomExists, deleteRoom, addUser, getUsers, removeUser } = require('./rooms')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// app.use(cors);

// Run when client connects
io.on('connection', socket => {
    console.log('New connection...');

    socket.on('joinRoom', ({ roomName, userName }) => {
        addUser(roomName, userName);
        socket.join(roomName);
        socket.emit('users', getUsers(roomName));
    });

    socket.on('disconnect', () => {
        console.log("Connection lost");
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/room/:roomName', function (req, res) {
    const roomName = req.params["roomName"]
    if (roomExists(roomName)) {
        res.sendFile(path.join(__dirname, 'public/game.html'));
    }
    else {
        res.status(404).send("<h1>Room doesn't exist.</h1>");
    }
});

app.post('/room', function (req, res) {
    const roomName = req.body["roomName"]
    // const userName = req.body["userName"]
    if (createRoom(roomName)) {
        // if (addUser(roomName, userName)) {
        //     res.status(200).send("Room created and user added");
        // }
        // else {
        //     res.status(500).send("User could not be added");
        // }
        res.status(200).send("Room created successfully");
    }
    else {
        res.status(500).send("Room could not be created");
    }
});

app.get('/user_uuid', cors(), function (req, res) {
    res.send('12432112413');
});

app.post('/words', function (req, res) {
    res.send(check_words(req.body));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));