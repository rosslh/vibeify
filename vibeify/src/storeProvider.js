import React, { Component } from "react";
import Store from "./store";

class StoreProvider extends Component {
  state = {
    spotifyToken: localStorage.getItem("spotifyToken") || ""
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
          }
        }}
      >
        {this.props.children}
      </Store.Provider>
    );
  }
}

export default StoreProvider;
