import type { posts } from '../types/posts';
// import { useEffect } from 'react';

import './Post.css'

interface postProps {
  post:posts;
  setModal: (value: {type: number, pid: number}) => void;
  index: number;
}
export function Post({post, setModal, index}:postProps) {
  // console.log(post.content);

  // console.log(`${post.title} index is ${index}`)


  function handleClick() {
    setModal({type: 1, pid: post.pid});
  }

  return (
    <div className="post" onClick={handleClick} style={{animationDelay: `${index*0.05}s`}}>
      <div className="post-gradient"></div>
      <div className="post-top">
        <button className="tag post-tag">Open</button>
        <p>{post.date}</p>
      </div>
      
      <h1>{post.title}</h1>
      <h2 style={{marginBottom:'20px'}}>{post.username}</h2>
      
      <p>{post.content}</p>
    </div>
  )
}