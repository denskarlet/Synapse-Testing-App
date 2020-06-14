import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";

const Loading = (props) => {
  const { isVerified, isLoading } = props;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isVerified ? <Redirect to="/" /> : <Redirect to="/login" />;
};

export default Loading;
