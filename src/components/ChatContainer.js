import React, { Component } from "react";
import Sidebar from "./Sidebar";
import ChatHeading from "./ChatHeading";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import {
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
  TYPING,
} from "../Events";

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      activeChat: null,
    };
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.emit(COMMUNITY_CHAT, this.resetChat);
  }

  resetChat = (chat) => {
    return this.addChat(chat, true);
  };

  addChat = (chat, reset) => {
    const { socket } = this.props;
    const { chats } = this.state;

    const newChats = reset ? [chat] : [...chats, chat];
    this.setState({ chats: newChats });

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}}`;
    const typingEvent = `${TYPING}-${chat.id}}`;

    socket.on(typingEvent);
    socket.on(messageEvent, this.addMessageToChat(chat.id));
  };
  addMessageToChat = (chatId) => {
    return (message) => {
      const { chats } = this.state;
      let newChats = chats.map((chat) => {
        if (chat.id === chatId) chat.messages.push(message);
        return chat;
      });
      this.setState({ chats: newChats });
    };
  };

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  setActiveChat = (activeChat) => {
    this.setState({ activeChat });
  };

  render() {
    const { user, logout } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className="container">
        <Sidebar
          logout={logout}
          user={user}
          chats={chats}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />
        <div className="chat-room-container">
          {activeChat !== null ? (
            <div className="chat-room">
              <ChatHeading name={activeChat.name} />
              <Messages
                messages={activeChat.messages}
                user={user}
                typingUser={activeChat.typingUser}
              />
              <MessageInput
                sendMessage={(message) => {
                  this.sendMessage(activeChat.id, message);
                }}
                sendTyping={(isTyping) => {
                  this.sendTyping(activeChat.id, isTyping);
                }}
              />
            </div>
          ) : (
            <div className="chat-room choose">
              <h3>Select a chat</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}
