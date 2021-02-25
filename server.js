const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const check_words = require('./game');

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

    socket.on('disconnect', () => {
        console.log("Connection lost");
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/room/:room_name', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/game.html'));
});

app.get('/user_uuid', cors(), function(req, res) {
    res.send('12432112413');
});

app.post('/words', function (req, res) {
    res.send(check_words(req.body));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));