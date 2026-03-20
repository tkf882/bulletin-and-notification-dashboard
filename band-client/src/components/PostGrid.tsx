import { Post } from './Post';
import type { posts } from '../types/posts';

import './PostGrid.css'

interface postGridProps {
  posts:posts[];
  setModal: (value: {type: number, pid: number}) => void;
}
export function PostGrid({posts, setModal}:postGridProps) {
  
  return (
    <div className="post-grid">
      {posts.map((p) => {
        if (p.parent === null) {
          return <Post key={p.pid} post={p} setModal={setModal}/>
        } else {
          return '';
        }
      })}

    </div>
  )
}