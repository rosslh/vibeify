import React, { Component } from 'react';
import headerGraphic from '../assets/headerGraphic.png';
import { flexbox } from '@material-ui/system';
// require('helvatica-neue-lt/index.css');

class Header extends Component {
    render() {
        const headerText = {
            textAlign: "center",
            margin:"auto",
            marginTop:-30,
            fontSize:100,
          };

          const subheaderText = {
            textAlign: "center",
            margin:"auto",
            marginTop:0,
            fontWeight:100,
            color:"#BFFFF0",
            fontSize:30,
          };


        return (
            <div style={{display:"flex", flexDirection:"column", alignItems: 'center'}}>
                <img src={headerGraphic} className="logo" alt="logo" height="100" width="130" />
                <h1 style={headerText}>vibeify</h1>
                <h1 style={subheaderText}>your personal intelligent DJ</h1>
            </div>
        );
    }
}

export default Header