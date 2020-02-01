import React, { Component } from 'react';
import headerGraphic from '../assets/headerGraphic.png';
import { Button  } from '@material-ui/core';
import { browserHistory } from 'react-router';
import settings from '../assets/icons8-settings.svg';
import SettingsPage from "../pages/settings";

class Nav extends Component {
    render() {
        const headerText = {
            textAlign: "left",
            margin:"auto",
            marginTop:0,
            fontSize:100,
          };


        return (
            <div style={{display:"flex", position:"absolute", alignItems:"center",width:"100%",justifyContent:"space-between", paddingRight:"16"}}>

                <img src={headerGraphic} className="logo" alt="logo" height="50" width="80"/>
                <h1 style={headerText}>vibeify</h1>
    
                <Button 
                className="Login_button"
                onClick={this.onSettings}
                variant="contained" color="0xfff"
                
                > 
                 <img src={settings} className="Spotify_logo_login" height="30" width="40"/>   
                </Button>

            </div>
        );
    }
    onSettings() {
        browserHistory.push("/settings")
        // this.setState({text: this.state.text++})
    }
}

export default Nav