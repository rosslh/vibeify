import React, { useEffect, useState, useContext } from "react";
import Store from "../store";
import { assert } from "@tensorflow/tfjs-core/dist/util";

const Songs = () => {
  const { spotifyToken, selectedIDs: playlistIds } = useContext(Store);

  const [songs, setSongs] = useState({});

  const [areTracksFetched, setAreTracksFetched] = useState(false);
  const [areFeaturesFetched, setAreFeaturesFetched] = useState(false);

  useEffect(() => {
    if (playlistIds && !areTracksFetched) {
      const getData = async () => {
        let songsFromPlaylists = [];
        await Promise.all(
          playlistIds.split(",").map(async id =>
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
  }, [playlistIds]);

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

  return Object.values(songs).sort((a, b) => b.litness - a.litness);
  // return (
  //   <div>
  //     {Object.keys(songs).length}
  //     {Object.keys(songs)
  //       .map(id => songs[id])
  //       .sort((a, b) => b.litness - a.litness)
  //       .map(song => (
  //         <div key={song.id}>
  //           {song.name} - {song.litness}
  //         </div>
  //       ))}
  //   </div>
  // );
};

export default Songs;
