import React, { Component } from 'react';
import MessageHistory from './Components/MessageHistory.js';
import TimedMessage from './Components/TimedMessage.js';
import UserInput from './Components/UserInput.js';
import CommandRegex from './Utils/CommandRegex.js';
import io from 'socket.io-client';
import './App.css';

const socket = io("http://localhost:4000");

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

    socket.on('message_to_room', (data) => {
      this.setState({messageList: this.state.messageList.concat(data.msg)});
    })

    socket.on('share_rooms', (data) => {
      this.setState({rooms: data.rooms});
    });
  }

  buildCreateRoomMessage = (createdRoom) => {
    if(createdRoom === null) {
      return `You are in room: ${this.state.currentRoom}. You must exit ('exit ${this.state.currentRoom}') before creating a new room.`;
    } else {
      return !this.state.rooms.includes(createdRoom) ? `Created and joined room: ${createdRoom}` : `Room name in use.`
    }
  }

  buildJoinRoomMessage = (roomToJoin) => {
    if(roomToJoin === null) {
      return `You are in room: ${this.state.currentRoom}. You must exit ('exit ${this.state.currentRoom}') before joining a new room.`;
    } else if(this.state.rooms.includes(roomToJoin)) {
      return `Joined room: ${roomToJoin}`;
    } else {
      return `Cannot join room: ${roomToJoin}, which does not currently exist.`;
    }
  }

  buildHelpMessage = () => `create <room> | exit <room> | help | join <room> | list-rooms`

  buildListRoomsMessage = () => {
    return this.state.rooms.length <= 0 ? `No open rooms.` : `Open rooms: ${(this.state.rooms.join(" | "))}`
  }

  detectKeywordsAndRespond = (input) => {
    if(input === "help") {
      this.setState({messageList: this.state.messageList.concat(this.buildHelpMessage())});

    } else if(input === "list-rooms") {
      this.setState({messageList: this.state.messageList.concat(this.buildListRoomsMessage())});

    } else if(CommandRegex.create.test(input)) {
      var createdRoom = input.substring(7);

      if(this.state.currentRoom) {
        createdRoom = null;
      } else if(!this.state.rooms.includes(createdRoom)) {
          this.setState({currentRoom: createdRoom}, () => {socket.emit('create_room', {room: createdRoom})});
      }
      this.setState({messageList: this.state.messageList.concat(this.buildCreateRoomMessage(createdRoom))});

    } else if(CommandRegex.exit.test(input)) {
      socket.emit('exit_room', {room: this.state.currentRoom});
      this.setState({currentRoom: null});

    } else if(CommandRegex.join.test(input)) {
      var roomToJoin = input.substring(5);

      if(this.state.currentRoom) {
        roomToJoin = null;
      } else if(this.state.rooms.includes(roomToJoin)) {
        this.setState({currentRoom: roomToJoin}, () => {socket.emit('join_room', {room: roomToJoin})});
      }
      this.setState({messageList: this.state.messageList.concat(this.buildJoinRoomMessage(roomToJoin))});

    } else {
      /*no command found--just send the message*/
      socket.emit('send_message', {
        msg: input,
        room: this.state.currentRoom
      });
    }
  }

  handleUserInput = (input) => {
    this.setState({
      messageList: this.state.messageList.concat(` =>${input}`)
    }, () => this.detectKeywordsAndRespond(input));
  }

  render() {
    return (
      <div className="App">
        <TimedMessage messageToDisplay="Welcome to chat-brew! Type 'help' for a list of commands." updateRate={50} />
        <MessageHistory messageList={this.state.messageList}/>
        <UserInput currentRoom={this.state.currentRoom} onEnter={(input) => this.handleUserInput(input)}/>
      </div>
    );
  }
}

export default App;
