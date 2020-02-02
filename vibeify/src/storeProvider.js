import React, { Component } from "react";
import Store from "./store";

class StoreProvider extends Component {
  state = {
    spotifyToken: localStorage.getItem("spotifyToken") || "",
    selectedIDs: localStorage.getItem("selectedIDs") || []
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
          setSelectedIDs: newToken => {
            this.setState({
              selectedIDs: newToken
            });
            localStorage.setItem("selectedIDs", newToken);
          }
        }}
      >
        {this.props.children}
      </Store.Provider>
    );
  }
}

export default StoreProvider;
