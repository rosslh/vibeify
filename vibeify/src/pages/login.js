import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import { Button  } from '@material-ui/core';
import spotify_logo from '../assets/spotify_logo.svg'

class LoginPage extends Component {
    state = {
        text: "Sign up with Spotify"
    }

    render() {
        return (
            <header className="Login-header">
                <Button 
                className="Login_button"
                onClick={this.onLogin}
                variant="contained" color="0xfff"
                >
                    <img src={spotify_logo} className="Spotify_logo_login" />
                    {this.state.text}
                </Button>
            </header>
        );
    }

    onLogin() {
        browserHistory.push("/play")
        // this.setState({text: this.state.text++})
    }
}

export default LoginPage