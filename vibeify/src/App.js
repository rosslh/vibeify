import React from "react";
import "./App.css";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import CameraPage from "./pages/camera/camera";
import LoginPage from "./pages/login";

function App() {
  return (
    <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={LoginPage} />
        <Route path={"home"} component={LoginPage} />
        <Route path={"play"} component={CameraPage} />
      </Route>
    </Router>
  );
}

export default App;
