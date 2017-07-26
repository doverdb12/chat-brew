import React, { Component } from 'react';

class UserInput extends Component {
  constructor(props) {
    super();

    this.state = {input: ""}
  }

  handleEnter = (e) => {
    if(e.key === 'Enter') {
      let inputToDisplay = this.state.input;
      this.setState({input: ""}, () => this.props.onEnter(inputToDisplay))
    }
  }

  handleChange = (e) => {this.setState({input: e.target.value})}

  handleInputBlur = () => {this.input.focus()}

  render() {
    return (
      <div className="UserInput">
        <li>
          <label> =>{`${this.props.currentRoom ? "(" + this.props.currentRoom + ")" : ""}`}
            <input
              autoFocus
              ref={(input) => this.input = input}
              onBlur={() => this.handleInputBlur()}
              onChange={(e) => this.handleChange(e)}
              onKeyPress={(e) => this.handleEnter(e)}
              name="name"
              type="text"
              value={this.state.input}
            />
          </label>
        </li>
      </div>
    );
  }
}

export default UserInput;
