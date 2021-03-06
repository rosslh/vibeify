import React, { useContext, useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Store from "../store";

const Player = ({
  currentBin,
  shouldInitializePlaylist,
  setShouldInitializePlaylist
}) => {
  const { spotifyToken, selectedIDs } = useContext(Store);

  const [isPlaying, setIsPlaying] = useState(false);
  const [songs, setSongs] = useState({});
  const [songQueue, setSongQueue] = useState([]);
  const [areTracksFetched, setAreTracksFetched] = useState(false);
  const [areFeaturesFetched, setAreFeaturesFetched] = useState(false);
  const [lastQueueUpdate, setLastQueueUpdate] = useState(0);

  const segmentSongs = () => {
    let quintSize = Math.floor(songQueue.length / 5);
    let segmentedSongsArr = [];
    for (let i = 0; i < songQueue.length; i += quintSize) {
      let ceil = i + quintSize;
      if (ceil >= songQueue.length) {
        ceil = songQueue.length;
      }
      let segment = songQueue.slice(i, ceil);
      segmentedSongsArr.push(segment);
    }
    if (!segmentedSongsArr.length)
      segmentedSongsArr = [[], [], [], [], []]

    return segmentedSongsArr;
  };

  // get list of songs
  useEffect(() => {
    if (shouldInitializePlaylist || (!areTracksFetched && spotifyToken)) {
      const getData = async () => {
        let songsFromPlaylists = [];
        await Promise.all(
          selectedIDs.map(async id =>
            fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
              headers: {
                Authorization: "Bearer " + spotifyToken
              }
            })
              .then(r => r.json())
              .then(r => {
                songsFromPlaylists = [
                  ...new Set([...songsFromPlaylists, ...r.items])
                ];
              })
              .catch(e => console.warn(JSON.stringify(e)))
          )
        );
        const newSongsObj = {};
        songsFromPlaylists.forEach(s => {
          newSongsObj[s.track.id] = s.track;
        });
        setSongs(newSongsObj);
        setAreTracksFetched(true);
        setAreFeaturesFetched(false);
        setShouldInitializePlaylist(false);
      };
      getData();
    }
  });

  const sum = lst => lst.reduce((a, b) => a + b, 0);

  // augment list of songs with features
  useEffect(() => {
    if (areTracksFetched && !areFeaturesFetched) {
      const getData = async () => {

        const songIds = Object.keys(songs);

        const featuresEndpoint = `https://api.spotify.com/v1/audio-features?ids=${songIds.join(
          ","
        )}`;

        const songsWithFeatures = await fetch(featuresEndpoint, {
          headers: {
            Authorization: "Bearer " + spotifyToken
          }
        }).then(r => r.json());

        const songsUpdate = { ...songs };

        songsWithFeatures.audio_features.forEach(s => {
          if (s) {
            const features = [s.energy]; // [s.tempo, s.danceability, s.energy];

            songsUpdate[s.id] = {
              ...songsUpdate[s.id],
              ...s,
              litness: sum(features) / features.length
            };
          }
        });
        
        setSongQueue(
          Object.keys(songs)
            .map(id => songs[id])
            .sort((a, b) => a.litness - b.litness)
        );

        setSongs(songsUpdate);
        setAreFeaturesFetched(true);
        console.log(segmentSongs()[currentBin]);
        //   await fetch(`https://api.spotify.com/v1/me/player/play`, {
        //     Authorization: "Bearer " + spotifyToken,
        //     method: "PUT",
        //     mode: "cors",
        //     headers: {
        //       "Content-Type": "application/json",

        //       Authorization: "Bearer " + spotifyToken
        //     },
        //     body: JSON.stringify({
        //       // uris: ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
        //       uris: cQ.map(s => `spotify:track:${s.id}`)
        //     })
        //   }).catch(r => {
        //     alert(r);
        //   });
      };
      getData();
    }
  });

  // // 
  // useEffect(() => {
  //   if (  //     selectedIDs.length &&
  //     (Date.now() - lastQueueUpdate > 18000 || shouldInitializePlaylist)
  //   ) {
  //     const getData = async () => {
  //       setAreTracksFetched(false);
  //       setAreFeaturesFetched(false);
  //       setShouldInitializePlaylist(false);
  //       setUseEffectSemaphore(false);
  //     }

  //     getData();
  //   }
  // });

  // const setQueue = async (cQ) => {

  // };

  return (
    <div
      style={{
        height: "5rem",
        display: "flex",
        flex: 1,
        marginLeft: "360px",
        marginRight: "360px",
        alignItems: "flex-end"
      }}
    >
      {spotifyToken && (
        <SpotifyPlayer
          styles={{
            bgColor: "white",
            color: "black",
            loaderColor: "#fff",
            sliderHandleColor: "white",
            sliderTrackColor: "white",
            savedColor: "#fff",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff"
          }}
          autoPlay
          showSaveIcon
          persistDeviceSelection
          play={isPlaying}
          token={spotifyToken}
          magnifySliderOnHover={true}
          uris={segmentSongs()[currentBin].map(x => `spotify:track:${x.id}`)}
          callback={state => {
            // alert(JSON.stringify(state))
          }}
        />
      )}
    </div>
  );
};

export default Player;
