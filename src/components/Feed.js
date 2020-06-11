/* eslint-disable react/prop-types */
import React from "react";
import Post from "./Post";

const Feed = (props) => {
  const { posts } = props;
  const arrayOfPosts = [];
  Object.keys(posts).forEach((tag, index) => {
    posts[tag].forEach((post, i) => {
      arrayOfPosts.push(<Post key={`post${(tag, i, index)}`} postInfo={post} />);
    });
  });
  return <div>{arrayOfPosts}</div>;
};
export default Feed;
