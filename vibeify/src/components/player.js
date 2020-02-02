import React, { useContext, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Store from "../store";
import Songs from "../pages/songs"

const Player = () => {
  const { spotifyToken, songs } = useContext(Store);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);

  if(!typeof(Songs()[0])=== "undefined"){
    console.log(Songs()[0], typeof(Songs()[0]))
  }

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
      {spotifyToken && queue && (
        <SpotifyPlayer
          styles={{

            bgColor: 'white',
            color: '#black',
            loaderColor: '#fff',
            sliderHandleColor:"#white",
            sliderTrackColor:"#white",
            savedColor: '#fff',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff'
          }}
          autoPlay
          showSaveIcon
          persistDeviceSelection
          play={isPlaying}
          token={spotifyToken}
          magnifySliderOnHover={true}
          // uris={[Songs()[0].uri]}
        />
      )}
    </div>
  );
};

export default Player;
