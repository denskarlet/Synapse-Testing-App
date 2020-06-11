import React, { useReducer } from "react";
import { Link } from "react-router-dom";

const Login = () => {
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
    fetch("api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
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
      <Link to="/api/user">Sign Up</Link>
    </>
  );
};
// form
// link to sign up
export default Login;
