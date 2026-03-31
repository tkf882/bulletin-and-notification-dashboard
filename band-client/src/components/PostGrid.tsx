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
  let loadOrderKey:number = Math.random(); // this will be used as a key that increments to force reload on each post when search/sorting.
  let loadOrder:number = 0;

  return (
    <div className="post-grid">
      {posts.map((p) => {
        loadOrderKey += 1;
        // console.log(`${p.title} has the  key ${loadOrderKey}`)

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
                loadOrder += 1;
                return <Post key={loadOrderKey} post={p} setModal={setModal} index={loadOrder}/>
              }
            } else if (allMatch) {
              // No search term, tag applied
              loadOrder += 1;
              return <Post key={loadOrderKey} post={p} setModal={setModal} index={loadOrder}/>
            }
          } else {
            if (search !== '') {
              // Search term, but no tags applied
              if (p.title.includes(search) || p.content.includes(search)) {
                loadOrder += 1;
                return <Post key={loadOrderKey} post={p} setModal={setModal} index={loadOrder}/>
              }
            } else {
              // No search and not tags applied. Show everything
              loadOrder += 1;
              return <Post key={loadOrderKey} post={p} setModal={setModal} index={loadOrder}/>
            }
          }
        } else {
          return '';
        }

      })}

    </div>
  )
}