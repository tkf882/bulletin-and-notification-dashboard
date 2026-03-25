import { Post } from './Post';
import type { posts } from '../types/posts';
import type { tags } from '../types/tags';
import type { tagFormat } from '../types/tagFormat';

import './PostGrid.css'

interface postGridProps {
  posts:posts[];
  setModal: (value: {type: number, pid: number}) => void;
  search: string;
  tags: tagFormat[];
}
export function PostGrid({posts, setModal, search, tags}:postGridProps) {
  console.log('inside post grids tag list:');
  console.log(tags);
  return (
    <div className="post-grid">
      {posts.map((p) => {
        if (p.parent === null && (p.title.includes(search) || p.content.includes(search))) {
          return <Post key={p.pid} post={p} setModal={setModal}/>
        } else {
          return '';
        }
      })}

    </div>
  )
}