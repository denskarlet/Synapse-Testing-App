import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div>The page you are looking for doesn't exist!</div>
      <Link to="/">Go back to the main page!</Link>
    </>
  );
};

export default NotFound;
