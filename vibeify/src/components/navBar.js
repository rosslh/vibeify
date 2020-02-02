import React, { Component } from 'react';
import headerGraphic from '../assets/headerGraphic.png';
import { Button } from '@material-ui/core';
import settings from '../assets/icons8-settings.svg';
import Modal from 'react-modal'
import SettingsPage from "../pages/settings";

class Nav extends Component {
    state = {
        showModal: false
    }

    render() {
        const headerText = {
            color: "white",
            textAlign: "left",
            margin: "auto",
            marginTop: -4,
            fontSize: 60,
            paddingRight: "2rem"
        };

        let visible = this.props.isLoggedIn ? "visible" : "hidden"

        return (
            <span>
                <div style={{ display: "flex", position: "absolute", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", flexDirection: "row" }}>
                        <img src={headerGraphic} alt="logo" height="65" width="80" />
                        <h2 style={headerText}>vibeify</h2>
                    </span>

                    <Button
                        className="Login_button"
                        onClick={() => { this.setState({ showModal: true }) }}
                        variant="contained" color="0xfff"
                        style={{ visibility: visible, zIndex: 1000 }}
                    >
                        <img src={settings} className="Spotify_logo_login" height="30" width="40" />
                    </Button>
                </div>
                <div>
                    <Modal
                        isOpen={this.state.showModal}
                        onRequestClose={this.closeModal}
                    >
                        <div>
                            <SettingsPage />
                        </div>
                        <button onClick={() => { this.setState({ showModal: false }) }}>close</button>
                    </Modal>
                </div>
            </span>
        );
    }
}

export default Nav