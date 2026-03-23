import type { posts } from '../../types/posts';

import './Comment.css'

interface commentProps {
  com: posts;
}
export function Comment({com}:commentProps) {

  return(
    <div className="comment">
      <p><span style={{'fontWeight': '600'}}>{com.username} {com.date}</span></p>
      <p>{com.content}</p>
    </div>
  )
}