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
        marginLeft:"360px",
        marginRight:"360px",
        alignItems: "flex-end"
      }}
    >
      {spotifyToken && (
        <SpotifyPlayer
          styles={{

            bgColor: 'white',
            color: '#black',
            loaderColor: '#fff',
            sliderHandleColor:"#white",
            sliderTrackColor:"#white",
            savedColor: '#fff',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}
          autoPlay
          showSaveIcon
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
