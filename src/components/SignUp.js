import React, { useReducer } from "react";

const SignUp = () => {
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
    fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInput),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
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
          Sign Up
        </button>
      </form>
    </div>
  );
};
// form
export default SignUp;
