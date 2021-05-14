const { checkWords, getLetters } = require('./game');

const rooms = {};
const roomToLetters = {};
const roomSettings = {};
const users = [];

// Create room
function createRoom(roomName, private = false, password = "") {
    if (roomName in rooms) {
        return false;
    }
    else {
        rooms[roomName] = [];
        setting = { "private": private, "password": password };
        roomSettings[roomName] = setting;
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

// Get settings of a room
function getRoomSettings(roomName) {
    return roomSettings[roomName];
}

// Delete room
function deleteRoom(roomName) {
    if (roomName in rooms) {
        delete rooms[roomName];
        delete roomToLetters[roomName];
        delete roomSettings[roomName];
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
    });
    return wordDicts;
}

// Reset word dicts to null
function resetWordDicts(roomName) {
    const roomUsers = rooms[roomName];
    if(roomUsers) {
        roomUsers.forEach(user => {
            user.wordDict = null;
        });
    }
}

module.exports = { createRoom, refreshRoomLetters, roomExists, getRoomLetters, getRoomSettings, deleteRoom, addUser, getUsers, ifWordDictsUpdated, removeUser, addWordList, getWordDicts, resetWordDicts }