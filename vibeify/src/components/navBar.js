import React, { Component } from 'react';
import headerGraphic from '../assets/headerGraphic.png';
import { Button } from '@material-ui/core';
import music from '../assets/music.png';
import Modal from 'react-modal'
import SettingsPage from "./settings"

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
                <div style={{ zIndex: 1, display: "flex", position: "absolute", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <span style={{ display: "flex", flexDirection: "row" }}>
                        <img src={headerGraphic} alt="logo" height="65" width="80" />
                        <h2 style={headerText}>vibeify</h2>
                    </span>

                    <Button
                        className="Login_button"
                        onClick={() => { this.setState({ showModal: true }) }}
                        color="0xfff"
                        style={{ visibility: visible, zIndex: 1000 }}
                    >
                        <img alt="Music" src={music} className="Spotify_logo_login" height="30" width="50" />
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
                        <button onClick={() => { this.setState({ showModal: false }); this.props.setShouldInitializePlaylist(true) }}>close</button>
                    </Modal>
                </div>
            </span>
        );
    }
}

export default Nav