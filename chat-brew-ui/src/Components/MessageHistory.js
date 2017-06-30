import React, { Component } from 'react';
import TimedMessage from './TimedMessage.js';
import '../App.css';

class MessageHistory extends Component {
  render() {
    return (
      <div className="MessageHistory">
        <ul>{this.props.messageList.map((msg, index) => <TimedMessage key={index} messageToDisplay={msg} updateRate={0} />)}</ul>
      </div>
    );
  }
}

export default MessageHistory;
