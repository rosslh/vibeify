import React from "react";
import "./App.css";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import CameraPage from "./pages/camera/camera";
import LoginPage from "./pages/login";
// import SettingsPage from "./pages/settings";
import SpotifyPage from "./pages/spotify";
import StoreProvider from "./storeProvider";

function App() {
  return (
    <StoreProvider>
      <Router history={browserHistory}>
        <Route path="/">
          <IndexRoute component={LoginPage} />
          <Route path={"home"} component={LoginPage} />
          <Route path={"play"} component={CameraPage} />
          {/* <Route path={"settings"} component={SettingsPage} /> */}
          <Route path={"spotify"} component={SpotifyPage} />
        </Route>
      </Router>
    </StoreProvider>
    // <CameraPage/>
    // <SettingsPage/>
  );
}

export default App;
