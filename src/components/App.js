import React, { useEffect, useState } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Loading from "./Loading";
import NotFound from "./NotFound";

const App = () => {
  const [cookie, setCookie] = useState(Cookies.get("client_id"));
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:3000/api/session/${cookie}`)
      .then((data) => data.json())
      .then((res) => {
        if (res.user_id) {
          setIsVerified(true);
        }
        setIsLoading(false);
      });
  }, []);
  if (isLoading) return <Loading isLoading={isLoading} isVerified={isVerified} />;
  return (
    <div>
      <Switch>
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/login">
          <Login setIsVerified={setIsVerified} isVerified={isVerified} />
        </Route>
        <Route
          exact
          path="/"
          render={() => {
            if (isVerified) {
              return <Home />;
            }
            return <Redirect to="/login" />;
          }}
        />
        <NotFound />
      </Switch>
    </div>
  );
};
export default App;
