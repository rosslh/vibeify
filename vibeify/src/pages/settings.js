import React, { Component } from 'react';
import { Button, Checkbox } from '@material-ui/core'
import spotify_logo from '../assets/spotify_logo.svg'
import { blue } from '@material-ui/core/colors';


class SettingsPage extends Component {
  state = {
    playlists: [
      {title: "Ether", artist: "Nas"},
      {title: "Ether", artist: "Bas"},
    ],
  }

  render() {
    return (
      <div className="Settings-modal">
        <table 
        style={{
          width: "80%",
          margin: "auto"
        }}>
          {this.state.playlists.map((val, i) => <Playlist {...val}/>)}
        </table>
      </div>
    );
  }

}

class Playlist extends Component {
  state = {
    chosen: false
  }

  render() {
    return (
      <tr>
        <td>
          <img alt="Spotify" src={spotify_logo} className="album_art" />
        </td>
        <td>
          {this.props.title}
        </td>
        <td>
          {this.props.artist}
        </td>
        <td>
          <Checkbox
            onChange={() => { this.setState({ chosen: !this.state.chosen }) }}
          />
        </td>
      </tr>
    );
  }
}

export default SettingsPage