import React from "react";
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import LandingPage from "../homepage/LandingPage";


function NonUser({ login }) {
  return(
    <Switch>
      <Route exact path="/">
        <LandingPage login={login} />
      </Route>
    </Switch>
  );
}

export default NonUser;