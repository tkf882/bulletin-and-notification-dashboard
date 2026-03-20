import type { posts } from '../types/posts';

import './Post.css'

interface postProps {
  post:posts;
  setModal: (value: {type: number, pid: number}) => void;
}
export function Post({post, setModal}:postProps) {
  // console.log(post.content);

  function handleClick() {
    setModal({type: 1, pid: post.pid});
  }

  return (
    <div className="post" onClick={handleClick}>
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