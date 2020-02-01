import React, { useContext, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Store from "../store";

const Player = () => {
  const { spotifyToken } = useContext(Store);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      style={{
        height: "10rem",
        display: "flex",
        alignItems: "flex-end"
      }}
    >
      {spotifyToken && (
        <SpotifyPlayer
          persistDeviceSelection
          play={isPlaying}
          token={spotifyToken}
          styles={{
            sliderColor: "#1cb954"
          }}
        />
      )}
    </div>
  );
};

export default Player;
