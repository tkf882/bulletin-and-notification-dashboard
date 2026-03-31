import { Post } from './Post';
import type { posts } from '../types/posts';
// import type { tags } from '../types/tags';
import type { tagFormat } from '../types/tagFormat';

import './PostGrid.css'

interface postGridProps {
  posts:posts[];
  setModal: (value: {type: number, pid: number}) => void;
  search: string;
  tags: tagFormat[];
}
export function PostGrid({posts, setModal, search, tags}:postGridProps) {
  // console.log('inside post grids tag list:');
  // console.log(tags);

  return (
    <div className="post-grid">
      {posts.map((p) => {

        // console.log(p.title);

        let containsTag:boolean = false;
        let allMatch:boolean = true;

        tags.forEach((tag) => {
          if (tag.selected) {
            containsTag = true;
            if (!p.tags.includes(tag.tag.tag_name)) {
              allMatch = false;
            }
          }
        })

        // console.log(`allMatch is: ${allMatch}`)
        // console.log('tags');
        // console.log(tags);




        if (p.parent === null) {
          // if no search logic applied, show  
          // if (!containsTag && search === '') {
          //   return <Post key={p.pid} post={p} setModal={setModal}/>
          // }

          if (containsTag) {
            if (search !== '') {
              // Search term and tag applied
              if ((p.title.includes(search) || p.content.includes(search)) && allMatch) {
                return <Post key={p.pid} post={p} setModal={setModal}/>
              }
            } else if (allMatch) {
              // No search term, tag applied
              return <Post key={p.pid} post={p} setModal={setModal}/>
            }
          } else {
            if (search !== '') {
              // Search term, but no tags applied
              if (p.title.includes(search) || p.content.includes(search)) {
                return <Post key={p.pid} post={p} setModal={setModal}/>
              }
            } else {
              // No search and not tags applied. Show everything
              return <Post key={p.pid} post={p} setModal={setModal}/>
            }
          }
        } else {
          return '';
        }

      })}

    </div>
  )
}