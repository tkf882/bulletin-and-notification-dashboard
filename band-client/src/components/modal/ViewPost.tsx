import { Comment } from './Comment';
import type { posts } from '../../types/posts';

import close from '../../assets/close-svg.svg';

import './ViewPost.css'
import './modal.css'

interface viewPostModal {
  modal: {type: number, pid: number};
  setModal: (value: {type: number, pid: number}) => void;
  postList: posts[];
}
export function ViewPost({modal, setModal, postList}:viewPostModal) {
  let currentPost:posts = postList[0];

  function handleClose() {
    setModal({type: 0, pid: -1});
  }

  postList.forEach((post) => {
    if (post.pid === modal.pid) {
      currentPost = post;
    }
  })


  return (
    <div className="modal">
      <img className="close-svg" src={close} onClick={handleClose}/>
      <div className="modal-container" >
        <button className="tag modal-tag">{currentPost.status === 1 ? 'Open' : 'Closed'}</button>
        <button className="tag-create">Mark as Closed</button>
        <p>{currentPost.date}</p>
        <h1>{currentPost.title}</h1>
        <h2>Posted by: {currentPost.username}</h2>
        <p>{currentPost.content}</p>
      </div>
      <div className="modal-container">
        {/* <h2>Tags</h2> */}
        <button className="tag modal-tag">tag1</button>
        <button className="tag modal-tag">tag2</button>
        <button className="tag modal-tag">tag3</button>
      </div>
      <div className="modal-container">
        <h2>Comments</h2>
          <textarea className="comment-input" placeholder="Add comment"></textarea>
          <button className="comment-button">Submit</button>
          
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>
          <Comment/>


      </div>
    
    </div>
  )
}