import { Comment } from './Comment';
import type { posts } from '../../types/posts';
import type { users } from '../../types/users';

import close from '../../assets/close-svg.svg';

import './ViewPost.css'
import './modal.css'

interface viewPostModal {
  modal: {type: number, pid: number};
  setModal: (value: {type: number, pid: number}) => void;
  postList: posts[];
  user: users;
  apiBase: string;
  fetchPosts: () => void
}
export function ViewPost({modal, setModal, postList, user, apiBase, fetchPosts}:viewPostModal) {
  // modal type 0: none, 1: view post, 2: create post, 3: edit post
  let currentPost:(posts | null) = null;
  postList.forEach((post) => {
    if (post.pid === modal.pid) {
      currentPost = post;
    }
  })

  function handleClose() {
    setModal({type: 0, pid: -1});
  }

  function handleEdit() {
    if (!currentPost) {return;}
    setModal({type: 3, pid: currentPost.pid});
  }

  function handlePostComment() {
    console.log('create a comment');
  }

  async function handleDelete() {
    console.log('delete the post');

    if (!currentPost || !user.token) {return;}

    await fetch(apiBase + 'posts' + '/' + currentPost.pid, {
      method: 'DELETE',
      headers: {
        'Authorization': user.token
      },
    })

    fetchPosts();
    handleClose();

  }




  return (
    <div className="modal">
      <img className="close-svg" src={close} onClick={handleClose}/>
      <div className="modal-container" >
        <button className="tag modal-tag">{currentPost && (currentPost['status'] === 1 ? 'Open' : 'Closed')}</button>
        <button className="tag-create">Mark as Closed</button>
        <p>{currentPost && (currentPost['date'])}</p>
        <h1>{currentPost && (currentPost['title'])}</h1>
        <h2>Posted by: {currentPost && (currentPost['username'])}</h2>
        <p>{currentPost && (currentPost['content'])}</p>
        {user.uid === (currentPost && (currentPost['user_id'])) && <button className="view-post-button" onClick={handleEdit}>Edit</button>}
        {user.uid === (currentPost && (currentPost['user_id'])) && <button className="view-post-button" onClick={handleDelete}>Delete</button>}
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
          <button className="view-post-button" onClick={handlePostComment}>Submit</button>
          
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