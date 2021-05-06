const { checkWords, getLetters } = require('./game');

const rooms = {};
const roomToLetters = {};
const users = [];

// Create room
function createRoom(roomName) {
    if (roomName in rooms) {
        return false;
    }
    else {
        rooms[roomName] = [];
        roomToLetters[roomName] = getLetters();
        return true;
    }
}

// Refresh room letters
function refreshRoomLetters(roomName) {
    if (roomName in rooms) {
        roomToLetters[roomName] = getLetters();
    }
}

// Check room exists
function roomExists(roomName) {
    return roomName in rooms;
}

// Get letters of a room
function getRoomLetters(roomName) {
    return roomToLetters[roomName];
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
        var user = { "name": userName, "id": userId, "wordDict": null, "leader": false };
        users.push(user);
        rooms[roomName].push(user);
        if (rooms[roomName].length == 1) {
            user.leader = true;
        }
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

// Checks if all user data for a room is received
function ifWordDictsUpdated(roomName) {
    let isUpdated = true;
    rooms[roomName].forEach(r => {
        if (r.wordDict === null) {
            isUpdated = false;
        }
    });
    return isUpdated;
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
            const isLeader = rooms[roomName][index].leader;
            rooms[roomName].splice(index, 1);
            if (isLeader && rooms[roomName].length > 0) {
                rooms[roomName][0].leader = true;
            }
        }
    }

    return rooms[roomName];
}

// Add word list to a user
function addWordList(wordList, userId) {
    const index = users.findIndex(user => user.id === userId);
    users[index].wordDict = checkWords(wordList);
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

module.exports = { createRoom, refreshRoomLetters, roomExists, getRoomLetters, deleteRoom, addUser, getUsers, ifWordDictsUpdated, removeUser, addWordList, getWordDicts }