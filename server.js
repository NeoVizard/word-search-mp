const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const { createRoom, refreshRoomLetters, roomExists, getRoomLetters, getRoomSettings, deleteRoom, addUser, getUsers, ifWordDictsUpdated, removeUser, addWordList, getWordDicts, resetWordDicts } = require('./rooms');

const app = express();
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/@popperjs/core/dist/umd'));
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Run when client connects
io.on('connection', socket => {
    console.log('New connection...');

    socket.on('joinRoom', ({ roomName, userName }) => {
        socket.emit('letters', getRoomLetters(roomName));
        addUser(roomName, userName, socket.id);
        socket.join(roomName);
        io.in(roomName).emit('users', getUsers(roomName));
    });

    socket.on('startGame', (roomName) => {
        io.in(roomName).emit('startGame');
    });

    socket.on('submit', (wordList) => {
        addWordList(wordList, socket.id);
        var roomName = Array.from(socket.rooms).filter(room => room !== socket.id)[0];
        if (ifWordDictsUpdated(roomName)) {
            io.in(roomName).emit('scoreUpdate', getWordDicts(roomName));
        }
    });

    socket.on('playAgain', (roomName) => {
        refreshRoomLetters(roomName);
        resetWordDicts(roomName);
        io.in(roomName).emit('reloadRoom');
        io.in(roomName).emit('letters', getRoomLetters(roomName));
    });

    socket.on('disconnecting', () => {
        socket.rooms.delete(socket.id);
        const roomName = socket.rooms.keys().next().value;

        const remainingUsers = removeUser(roomName, socket.id);
        if (remainingUsers.length !== 0) {
            io.in(roomName).emit('users', remainingUsers);
        }
        else {
            deleteRoom(roomName);
        }
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
    if (createRoom(roomName)) {
        res.status(200).send("Room created successfully");
    }
    else {
        res.status(500).send("Room could not be created");
    }
});

app.get('/user_uuid', cors(), function (req, res) {
    res.send('12432112413');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));