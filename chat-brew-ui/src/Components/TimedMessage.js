import React, { Component } from 'react';
import '../App.css';

class TimedMessage extends Component {
  constructor(props) {
    super();

    this.state = {
      messageToDisplay: props.messageToDisplay,
      displayedText: "",
      updateRate: props.updateRate
    }

    this.updateDisplayedMessage = this.updateDisplayedMessage.bind(this);
  }

  updateDisplayedMessage() {
    if(this.state.messageToDisplay) {
      this.setState({
        displayedText: this.state.displayedText.concat(this.state.messageToDisplay[0]),
        messageToDisplay: this.state.messageToDisplay.substr(1, this.state.messageToDisplay.length)
      }, () => setTimeout(this.updateDisplayedMessage, this.state.updateRate));
    }
  }

  componentDidMount() {
    this.updateDisplayedMessage();
  }

  render() {
    return (
      <div className="TimedMessage">
        <li>{this.state.displayedText}</li>
      </div>
    );
  }
}

export default TimedMessage;
