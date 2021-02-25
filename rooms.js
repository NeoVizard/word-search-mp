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
function addUser(roomName, userName) {
    if (roomName in rooms) {
        users.push(userName);
        rooms[roomName].push(userName);
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
function removeUser(roomName, userName) {
    if (userName in users) {
        users.splice(users.indexOf(userName), 1);
    }

    if (roomName in rooms && userName in rooms[roomName]) {
        rooms[roomName].splice(rooms[roomName].indexOf(userName), 1);
    }
}

module.exports = { createRoom, roomExists, deleteRoom, addUser, getUsers, removeUser }