import React, { Component } from "react";
import Store from "./store";

class StoreProvider extends Component {
  state = {
    spotifyToken: localStorage.getItem("spotifyToken") || "",
    selectedIDs: []
  };

  render() {
    return (
      <Store.Provider
        value={{
          spotifyToken: this.state.spotifyToken,
          setSpotifyToken: newToken => {
            this.setState({
              spotifyToken: newToken
            });
            localStorage.setItem("spotifyToken", newToken);
          },

          selectedIDs: this.state.selectedIDs,
          setSelectedIDs: newIds => {
            this.setState({
              selectedIDs: newIds
            });
          }
        }}
      >
        {this.props.children}
      </Store.Provider>
    );
  }
}

export default StoreProvider;
