const io = require('./server.js').io;

const {VERIFY_USER, USER_CONNECTED, LOGOUT} = require('../Events');

const {createUser, createMessage, createChat} = require('../Creators');

const connectedUsers = {};

socket.on(VERIFY_USER, (nickname, callback) =>{
    if(isUser(connectedUsers, nickname)){
        callback({isUser: true, user: null})
    }
    else{
        callback({isUser: false, user: createUser({name: nickname})})
    }
});

function addUser(userList, username){
    let list = Object.assign({}, userList);
    list[user.name] = user;
    return list;
}

function removeUser(userList, username){
    let list = Object.assign({}, userList);
    delete list[username];
    return list;
}

function isUser(userList, username){
    return username in userList
}

module.exports = (socket) => {
    console.log(`Socket ID: ${socket.id}`)
};