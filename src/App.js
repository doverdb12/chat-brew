import React, { Component } from 'react';
import MessageHistory from './Components/MessageHistory.js';
import TimedMessage from './Components/TimedMessage.js';
import UserInput from './Components/UserInput.js';
import io from 'socket.io-client';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      currentRoom: null,
      messageList: [],
      rooms: [],
      socket: null
    }

    this.buildHelpMessage = this.buildHelpMessage.bind(this);
    this.detectKeywordsAndRespond = this.detectKeywordsAndRespond.bind(this);
  }

  componentDidMount() {

  }

  buildHelpMessage() {
    return "help | join <room> | create <room> | exit <room> | list-rooms"
  }

  detectKeywordsAndRespond(input) {
    switch(input) {
      case "help":
        this.setState({
          messageList: this.state.messageList.concat(this.buildHelpMessage())
        });
        break;
      default:
        break;
    }
  }

  handleUserInput(input) {
    this.setState({
      messageList: this.state.messageList.concat(input)
    }, () => this.detectKeywordsAndRespond(input));
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
