import React, { Component } from 'react'

export default class LoginForm extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             nickname: "",
             error:""
        }
    }
    
    render() {
        const {nickname, error} = this.state;
        return (
            <div className="login">
                <form onSubmit={this.handleSubmit} className="login-form">
                    <label htmlFor="nickname">
                        <h2>Choose a nickname to start chatting</h2>
                    </label>
                    <input 
                        type="text" 
                        id="nickname" 
                        ref={(input) => {this.textInput = input}}
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={"type something dope"}/>
                        <div className="loginError">{error ? error:null}</div>
                </form>
            </div>
        )
    }
}
