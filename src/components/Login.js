import React, { useReducer, useState } from "react";
import { Link, Redirect } from "react-router-dom";

const Login = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  const [toRegister, setToRegister] = useState(false);
  const [userInput, setUserInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name } = e.target;
    const newValue = e.target.value;
    setUserInput({ [name]: newValue });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("session response", response);
        if (response.user_id) {
          setIsLogged(true);
          props.setIsVerified(true);
        } else {
          setToRegister(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (isLogged && props.isVerified) return <Redirect to="/" />;
  if (toRegister) return <Redirect to="/register" />;
  return (
    <>
      <form>
        <input
          autoComplete="off"
          className="username"
          name="username"
          type="text"
          placeholder="username"
          value={userInput.username}
          onChange={handleChange}
        />
        <input
          autoComplete="off"
          className="password"
          name="password"
          type="password"
          placeholder="password"
          value={userInput.password}
          onChange={handleChange}
        />
        <button type="submit" onClick={handleSubmit}>
          Login
        </button>
      </form>
      <Link to="/register">Sign Up</Link>
    </>
  );
};
export default Login;
