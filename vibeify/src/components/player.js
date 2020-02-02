import React, { useContext, useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import Store from "../store";

const Player = ({
  howActive
}) => {
  const { spotifyToken, selectedIDs } = useContext(Store);
  const [isPlaying, setIsPlaying] = useState(false);

  const [songs, setSongs] = useState({});

  const [areTracksFetched, setAreTracksFetched] = useState(false);
  const [areFeaturesFetched, setAreFeaturesFetched] = useState(false);

  const [lastQueueUpdate, setLastQueueUpdate] = useState(0);

  const segmentSongs = (howActive, songs) => {
    let quintSize = Math.floor(songs.length / 5)
    let segmentedSongsArr = [];
    for (let i = 0; i < songs.length; i += quintSize) {
      let ceil = i + quintSize
      if (ceil >= songs.length) {
        ceil = songs.length
      }
      let segment = songs.slice(i, ceil)
      segmentedSongsArr.push(segment)
    }
    return segmentedSongsArr
  }

  useEffect(() => {
    if (!areTracksFetched) {
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
                alert(JSON.stringify(r.items.length));
                songsFromPlaylists = [
                  ...new Set([...songsFromPlaylists, ...r.items])
                ];
              })
          )
        );
        const newSongsObj = {};
        songsFromPlaylists.forEach(s => {
          newSongsObj[s.track.id] = s.track;
        });
        setSongs(newSongsObj);
      };
      getData();
      setAreTracksFetched(true);
    }
  }, [selectedIDs]);

  const sum = lst => lst.reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (areTracksFetched && !areFeaturesFetched) {
      const getData = async () => {
        const songIds = Object.keys(songs);

        const featuresEndpoint = `https://api.spotify.com/v1/audio-features?ids=${songIds}`;

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

        setSongs(songsUpdate);
      };
      getData();
      setAreFeaturesFetched(true);
    }
  }, [songs]);

  useEffect(async () => {
    if (songs.length && Date.now() - lastQueueUpdate > 180000) {
        await setQueue();
        setLastQueueUpdate(Date.now())
    }
    
  }, [songs]);

  const setQueue = async () => {
    await fetch(`https://api.spotify.com/v1/me/player/play`, {
      headers: {
        Authorization: "Bearer " + spotifyToken,
        method: "PUT",
        body: JSON.stringify(
          {
            uris: Object.keys(songs).map(key => `spotify:track:${songs[key].id}`)
          }
        )
      }
    }).then(r => r.json()).then(r => {
      alert(JSON.stringify(r));
    })
      .catch(r => alert(r))
  };

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
            bgColor: 'white',
            color: 'black',
            loaderColor: '#fff',
            sliderHandleColor: "white",
            sliderTrackColor: "white",
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
          uris={songs}
          callback={(state) => {
            // alert(JSON.stringify(state))
          }}
        />
      )}
    </div>
  );
};

export default Player;
