import React, { Component, useEffect, useState, useContext } from 'react';
import { Checkbox } from '@material-ui/core'
import noIcon from '../assets/noIcon.png'
import Store from "../store";


const SettingsPage = () => {
  const { spotifyToken } = useContext(Store);

  const [playlists, setPlaylistOptions] = useState([]);
  const { selectedIDs, setSelectedIDs } = useContext(Store);

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
          let img = noIcon
          if (element.tracks.total !== 0)
            img = element.images[0].url

          return ({
            image: img,
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
    let currentIDs = selectedIDs
    if (currentIDs.includes(id))
      currentIDs = currentIDs.filter((sID) => sID != id)
    else 
      currentIDs.push(id)
    
    setSelectedIDs(currentIDs);
  };

  return (
    <div className="Settings-modal">
      <table
        style={{
          width: "90%",
          margin: "auto"
        }}>
        <tr>
          <td />
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
          <img alt="Spotify" src={this.props.image} className="album_art" />
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