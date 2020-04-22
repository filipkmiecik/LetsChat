import React, { Component } from 'react';
import io from 'socket.io-client';
import LoginForm from './LoginForm';
import {USER_CONNECTED, LOGOUT} from '../Events'

const socketUrl = "http://192.168.1.110:3001";

export default class Layout extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             socket: null,
             user: null
        };
    }

    componentWillMount() {
        this.loadSocket();
    };

    loadSocket = () => {
        const socket = io(socketUrl)
        socket.on('connect', () => {
            console.log("Connected");
        })
        this.setState({socket})
    };

    connectUser = (user) => {
        const {socket} = this.state;
        socket.emit(USER_CONNECTED, user);
        this.setState({user});
    }

    disconnectUser = () => {
        const {socket} = this.state;
        socket.emit(LOGOUT)
        this.setState({user:null})
    }
    
    render() {
        const {socket} = this.state;
        return (
            <div className="container">
                <LoginForm socket={socket} setUser={this.setUser}/>
            </div>
        )
    };
}
