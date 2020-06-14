/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from "react";
import Feed from "./Feed";

const Tags = () => {
  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState({
    animals: [{ author: "Denis", message: "animals are cute", tag: "animals" }],
    space: [{ author: "Mark", message: "space is vast", tag: "space" }],
    cars: [{ author: "Hang", message: "cars go fast", tag: "cars" }],
  });
  const webSocket = useRef(null);
  useEffect(() => {
    webSocket.current = new WebSocket(`ws://localhost:3000/api`);
  }, []);

  useEffect(() => {
    webSocket.current.onopen = (e) => {
      console.log("WS connection is now open!");
    };
    webSocket.current.onmessage = (event) => {
      console.log(event.data);
      console.log("Incoming WS message!");
      const message = JSON.parse(event.data);
      const key = ""; // tag
      const msg = ""; // payload
      // setPosts({ ...posts, [key]: msg });
    };
    webSocket.current.onclose = (event) => {
      console.log("WebSocket connection is closed!");
    };
  });

  const handleChange = (e) => {
    setTag(e.target.value);
  };
  const subscribeToTag = (e) => {
    setPosts({ ...posts, [tag]: [] });
    const message = {
      [`SUBSCRIBE /message/${tag}`]: {},
    };
    webSocket.current.send(JSON.stringify(message));
    setTag("");
  };
  const unsubscribeFromTag = (name) => {
    webSocket.current.send(JSON.stringify(`UNSUBSCRIBE localhost:3000/api/message/${tag}`));
    delete posts[name];
    setPosts({ ...posts });
  };
  const arrayOfTags = Object.keys(posts).map((subTag, index) => {
    return (
      <span className="tag" key={`tag${index}`}>
        {subTag}
        <button type="button" onClick={() => unsubscribeFromTag(subTag)}>
          X
        </button>
      </span>
    );
  });
  return (
    <>
      <input value={tag} onChange={handleChange} placeholder="Find a tag..." type="text" required />
      <button type="button" onClick={subscribeToTag}>
        Subscribe!
      </button>
      <div style={{ display: "flex", flexDirection: "column" }}>{arrayOfTags}</div>
      {/* <Feed posts={posts} /> */}
    </>
  );
};
export default Tags;
