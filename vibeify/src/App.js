import React from "react";
import "./App.css";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import CameraPage from "./pages/camera";
import LoginPage from "./pages/login";
import SettingsPage from "./pages/settings";

function App() {
  return (
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={LoginPage} />
        <Route path={"home"} component={LoginPage} />
        <Route path={"play"} component={CameraPage} />
        <Route path={"settings"} component={SettingsPage} />
      </Route>
    </Router>
    // <CameraPage/>
    // <SettingsPage/>
  );
}

export default App;
