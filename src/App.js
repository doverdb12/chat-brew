import React, { Component } from 'react';
import MessageHistory from './Components/MessageHistory.js';
import TimedMessage from './Components/TimedMessage.js';
import UserInput from './Components/UserInput.js';
import io from 'socket.io-client';
import './App.css';

const socket = io("http://localhost:4000");

const commandRegex = {
  create: /^create [\S]+$/,
  join: /^join [\S]+$/
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentRoom: null,
      messageList: [],
      rooms: []
    }
  }

  componentDidMount() {

    socket.on('connect', () => socket.emit('get_rooms'));

    socket.on('share_rooms', (data) => {
      this.setState({
        rooms: this.state.rooms.concat(data.rooms) //need to watch out for dups here maybe?
      });
    });
  }

  buildHelpMessage = () =>`help | join <room> | create <room> | exit <room> | list-rooms`

  detectKeywordsAndRespond = (input) => {
    if(input === "help") {
      this.setState({messageList: this.state.messageList.concat(this.buildHelpMessage())});
    } else if(commandRegex.create.test(input)) {
      let createdRoom = input.substring(7);
      this.setState({
        currentRoom: createdRoom,
        rooms: this.state.rooms.concat(createdRoom)
      }, () => socket.emit('create_room', {room: this.state.currentRoom}));
    } else if(input === "list-rooms") {
      console.log(this.state.rooms);
    }
  }

  handleUserInput = (input) => {
    this.setState({messageList: this.state.messageList.concat(input)}, () => this.detectKeywordsAndRespond(input));
  }

  render() {
    return (
      <div className="App">
        <TimedMessage messageToDisplay="Welcome to chat-brew! Type 'help' for a list of commands." updateRate={50} />
        <MessageHistory messageList={this.state.messageList}/>
        <UserInput onEnter={(input) => this.handleUserInput(input)}/>
      </div>
    );
  }
}

export default App;
