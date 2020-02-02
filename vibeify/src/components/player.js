import React, { useContext, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Store from "../store";

const Player = () => {
  const { spotifyToken } = useContext(Store);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      style={{
        height: "5rem",
        display: "flex",
        flex:1,
        alignItems: "flex-end"
      }}
    >
      {spotifyToken && (
        <SpotifyPlayer
          styles={{
            bgColor: '#333',
            color: '#fff',
            loaderColor: '#fff',
            sliderColor: '#1cb954',
            savedColor: '#fff',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}
          persistDeviceSelection
          play={isPlaying}
          token={spotifyToken}
          magnifySliderOnHover={true}
          uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']}
        />
      )}
    </div>
  );
};

export default Player;
