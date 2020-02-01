import React, { Component } from 'react';
import { Checkbox } from '@material-ui/core'
import spotify_logo from '../assets/spotify_logo.svg'


class SettingsPage extends Component {
  state = {
    selectedIDs: [],
    playlists: [
      {title: "Jazz", length: "2h 56m", onPress: () => {this.editIds(0)}},
      {title: "Funk", length: "1h 34m", onPress: () => {this.editIds(1)}},
    ],
  }

  editIds(id) {
    let currentIDs = this.state.selectedIDs
    if (currentIDs.includes(id))
      currentIDs = currentIDs.filter((sID) => sID != id)
    else
      currentIDs.push(id)

    this.setState({selectedIDs: currentIDs})
    console.log(currentIDs)
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
          {this.props.length}
        </td>
        <td>
          <Checkbox
            onChange={this.props.onPress}
          />
        </td>
      </tr>
    );
  }
}

export default SettingsPage