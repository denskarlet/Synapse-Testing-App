import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import Body from "./Body";
import Login from "./Login";
import SignUp from "./SignUp";

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/api/user">
          <SignUp />
        </Route>
        <Route exact path="/home">
          <Body />
        </Route>
      </Switch>
    </div>
  );
};
export default App;
