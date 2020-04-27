import React, { Component } from "react";
import { VERIFY_USER } from "../Events";

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: "",
      error: "",
    };
  }

  setUser = ({ user, isUser }) => {
    console.log(user, isUser);
    if (isUser) {
      this.setError("This nickname is taken, come up with something else");
    } else {
      this.setError("");
      this.props.setUser(user);
    }
  };

  setError = (error) => {
    this.setState({ error });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { socket } = this.props;
    const { nickname } = this.state;
    socket.emit(VERIFY_USER, nickname, this.setUser);
  };

  handleChange = (e) => {
    this.setState({ nickname: e.target.value });
  };

  render() {
    const { nickname, error } = this.state;
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit} className="login-form">
          <label htmlFor="nickname">
            <h2>Choose a nickname to start chatting</h2>
          </label>
          <input
            type="text"
            id="nickname"
            ref={(input) => {
              this.textInput = input;
            }}
            value={nickname}
            onChange={this.handleChange}
            placeholder={"type something dope"}
          />
          <div className="error">{error ? error : null}</div>
        </form>
      </div>
    );
  }
}
