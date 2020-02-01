import React, { useEffect, useContext } from "react";
import Store from "../store";

const Spotify = () => {
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const clientId = "84b69b9e93104ae793a7ff8fbd04ec70";
  const redirectUri = window.location.href;
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
    "user-modify-playback-state",
    "streaming"
  ];

  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

  const { spotifyToken, setSpotifyToken } = useContext(Store);

  useEffect(() => {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // new token received
      setSpotifyToken(_token);
    }
  }, []);

  return (
    <div>
      {!spotifyToken && (
        <a
          className="btn btn--loginApp-link"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            "%20"
          )}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
      )}
      {spotifyToken && (
        // Spotify Player Will Go Here In the Next Step
        <div>{spotifyToken}</div>
      )}
    </div>
  );
};

export default Spotify;
