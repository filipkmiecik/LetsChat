const io = require("./server.js").io;

const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
} = require("../Events");

const { createUser, createMessage, createChat } = require("../Creators");

let connectedUsers = {};

let communityChat = createChat();

module.exports = (socket) => {
  console.log(`Socket ID: ${socket.id}`);

  let sendMessageToChat;

  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({ isUser: false, user: createUser({ name: nickname }) });
    }
  });

  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    sendMessageToChat = sendMessageToChat(user.name);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);

      io.emit(USER_DISCONNECTED, connectedUsers);
    }
  });

  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
  });

  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });
  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message);
  });
};

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECEIVED}=${chatId}`,
      createMessage({ message, sender })
    );
  };
}
function addUser(userList, user) {
  let list = Object.assign({}, userList);
  list[user.name] = user;
  return list;
}

function removeUser(userList, user) {
  let list = Object.assign({}, userList);
  delete list[user];
  return list;
}

function isUser(userList, user) {
  return user in userList;
}
