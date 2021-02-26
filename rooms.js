const check_words = require('./game');

const rooms = {};
const users = [];

// Create room
function createRoom(roomName) {
    if (roomName in rooms) {
        return false;
    }
    else {
        rooms[roomName] = [];
        return true;
    }
}

// Check room exists
function roomExists(roomName) {
    return roomName in rooms;
}

// Delete room
function deleteRoom(roomName) {
    if (roomName in rooms) {
        delete rooms[roomName];
    }
}

// Add user to room
function addUser(roomName, userName, userId) {
    if (roomName in rooms) {
        var user = { "name": userName, "id": userId, "wordDict": {} };
        users.push(user);
        rooms[roomName].push(user);
        return true;
    }
    else {
        return false;
    }
}

// Get list of users in a room
function getUsers(roomName) {
    return rooms[roomName];
}

// Remove user from room
function removeUser(roomName, userId) {
    const index = users.findIndex(user => user.id == userId);
    if (index !== -1) {
        users.splice(index, 1);
    }

    if (roomName in rooms) {
        const index = rooms[roomName].findIndex(user => user.id == userId);
        if (index !== -1) {
            rooms[roomName].splice(index, 1);
        }
    }

    return rooms[roomName];
}

// Add word list to a user
function addWordList(wordList, userId) {
    const index = users.findIndex(user => user.id === userId);
    users[index].wordDict = check_words(wordList);
}

// Get word dicts
function getWordDicts(roomName) {
    const roomUsers = rooms[roomName];
    var wordDicts = {}
    roomUsers.forEach(user => {
        wordDicts[user.name] = users.filter(u => u.id === user.id)[0].wordDict;
    })
    return wordDicts;
}

module.exports = { createRoom, roomExists, deleteRoom, addUser, getUsers, removeUser, addWordList, getWordDicts }