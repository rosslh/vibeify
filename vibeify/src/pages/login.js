import React, { Component } from 'react';
import { browserHistory } from 'react-router'

class LoginPage extends Component {
    state = {
        text: "hi"
    }

    render() {
        return (
            <header className="App-header">
                <button onClick={this.onLogin}>
                    {this.state.text}
                </button>
            </header>
        );
    }

    onLogin() {
        browserHistory.push("/play")
    }
}

export default LoginPage