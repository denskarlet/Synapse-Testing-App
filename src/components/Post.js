/* eslint-disable react/prop-types */
import React from "react";

const Post = (props) => {
  const { postInfo } = props;
  const { author, message, tag } = postInfo;
  console.log(postInfo);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "5px",
        border: "solid 1px grey",
      }}
    >
      <span>
        Author:
        {author}
      </span>
      <span>{message}</span>
      <span>
        Tag:
        {tag}
      </span>
    </div>
  );
};
export default Post;
