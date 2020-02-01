import React, { Component, useEffect, useState, useContext } from 'react';
import { Checkbox } from '@material-ui/core'
import spotify_logo from '../assets/spotify_logo.svg'
import Store from "../store";


const SettingsPage = () => {
  const { spotifyToken } = useContext(Store);

  const [state, setState] = useState({
    selectedIDs: [],
  });
  const [playlists, setPlaylistOptions] = useState([]);

  useEffect(() => {
    if (!playlists.length) {
      const fetchData = async () => {
        const endpoint = "https://api.spotify.com/v1/me/playlists";
        const result = await fetch(endpoint, {
          headers: {
            Authorization: "Bearer " + spotifyToken
          }
        })
          .then(r => r.json())
          .catch(e => alert(`Error: ${JSON.stringify(e)}`));
 
          setPlaylistOptions(result.items.map(element => { 
          return ({
            title: element.name,
            length: element.tracks.total,
            onPress: () => editIds(element.id)
          })
        }));
      };
      fetchData();
    }
  });


  const editIds = (id) => {
    let currentIDs = state.selectedIDs
    if (currentIDs.includes(id))
      currentIDs = currentIDs.filter((sID) => sID != id)
    else
      currentIDs.push(id)

    setState({ selectedIDs: currentIDs })
  };

  return (
    <div className="Settings-modal">
      <table
        style={{
          width: "80%",
          margin: "auto"
        }}>
          <tr>
            <td/>
            <td>
              <h3>Name</h3>
            </td>
            <td>
              <h3>Number of Songs</h3>
            </td>
            <td>
              <h3>Chosen</h3>
            </td>
          </tr>
        {playlists.map((val, i) => <Playlist {...val} />)}
      </table>
    </div>
  );
};


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