import React, { Component } from 'react';
import headerGraphic from '../assets/headerGraphic.png';
import { Button } from '@material-ui/core';
import { browserHistory } from 'react-router';
import settings from '../assets/icons8-settings.svg';
import Modal from 'react-modal'
import SettingsPage from "../pages/settings";

class Nav extends Component {
    state = {
        showModal: false
    }

    render() {
        const headerText = {
            color:"white",
            textAlign: "left",
            margin: "auto",
            marginTop: 0,
            fontSize: 100,
        };

        let visible = this.props.isLoggedIn ? "visible" : "hidden"

        return (
            <div style={{ display: "flex", position: "absolute", alignItems: "center", width: "100%", justifyContent: "space-between", paddingRight: "16" }}>

                <img src={headerGraphic} className="logo" alt="logo" height="65" width="80" />
                <h1 style={headerText}>vibeify</h1>

                <Button
                    className="Login_button"
                    onClick={() => { this.setState({ showModal: true }) }}
                    variant="contained" color="0xfff"
                    style={{visibility: visible}}
                >
                    <img src={settings} className="Spotify_logo_login" height="30" width="40" />
                </Button>
                <div>
                    <Modal
                        isOpen={this.state.showModal}
                        onRequestClose={this.closeModal}
                    >
                        <div>
                            <SettingsPage/>
                        </div>
                        <button onClick={() => { this.setState({ showModal: false }) }}>close</button>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Nav