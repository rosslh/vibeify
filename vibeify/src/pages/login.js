import React, { useEffect, useContext } from "react";
import { Button } from "@material-ui/core";
import { browserHistory } from "react-router";
import spotify_logo from "../assets/spotify_logo.svg";
import Store from "../store";

const Login = () => {
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
    "streaming",
    "user-read-email",
    "user-read-private"
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
      browserHistory.push("/play");
    } else if (spotifyToken) {
      browserHistory.push("/play");
    }
  }, []);

  return (
    <header className="Login-header">
      <Button
        className="Login_button"
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`}
        variant="contained"
        color="0xfff"
      >
        <img alt="Spotify" src={spotify_logo} className="Spotify_logo_login" />
        Login to Spotify
      </Button>
    </header>
  );
};

export default Login;
