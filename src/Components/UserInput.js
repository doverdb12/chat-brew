import React, { Component } from 'react';

class UserInput extends Component {
  constructor() {
    super();

    this.state = {
      input: ""
    }
  }

  handleEnter(e) {
    if(e.key === 'Enter') {
      let inputToDisplay = this.state.input;
      this.setState({input: ""}, () => this.props.onEnter(inputToDisplay))
    }
  }

  handleChange(e) {
    this.setState({input: e.target.value});
  }

  render() {
    return (
      <div className="UserInput">
        <li>
          <label> =>
            <input
              autoFocus
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
