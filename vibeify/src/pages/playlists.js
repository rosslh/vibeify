import React, { useEffect, useState, useContext } from "react";
import Store from "../store";

const Playlists = () => {
  const [playlistOptions, setPlaylistOptions] = useState([]);
  const { spotifyToken } = useContext(Store);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = "https://api.spotify.com/v1/me/playlists";
      const result = await fetch(endpoint, {
        headers: {
          Authorization: "Bearer " + spotifyToken
        }
      })
        .then(r => r.json())
        .catch(e => alert(`Error: ${JSON.stringify(e)}`));
      setPlaylistOptions(result.items);
    };
    fetchData();
  }, []);
  return (
    <div>
      {playlistOptions.map(x => (
        <div key={x.id}>
          {x.images && x.images[2] && x.images[2].url} - {x.name} -{" "}
          {x.tracks.total}
        </div>
      ))}
    </div>
  );
};

export default Playlists;
