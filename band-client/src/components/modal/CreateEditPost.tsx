import type { posts } from '../../types/posts';
import type { users } from '../../types/users';
import { useState, useRef, useEffect } from 'react';

import close from '../../assets/close-svg.svg';

import './CreateEditPost.css'
import './modal.css'


interface createEditPostProps {
  modal: {type: number, pid: number};
  setModal: (value: {type: number, pid: number}) => void;
  postList: posts[];
  apiBase: string;
  user: users;
  fetchPosts: () => void
}
export function CreateEditPost({modal, setModal, postList, apiBase, user, fetchPosts}:createEditPostProps) {
  const [tagPopup, setTagPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const titleRef = useRef<any>(null);
  const contentRef = useRef<any>(null);

  // modal type 0: none, 1: view post, 2: create post, 3: edit post
  let currentPost:(posts | null) = null;
  
  postList.forEach((post) => {
    if (post.pid === modal.pid) {
      currentPost = post;
    }
  });

  useEffect(() => {
    const titleElem = titleRef.current;
    if (titleElem && currentPost) {
      titleElem.value = currentPost['title'];
    }
    const contentElem = contentRef.current;
    if (contentElem && currentPost) {
      contentElem.value = currentPost['content'];
    }
  }, [])



  function toggleTagPopup() {
    setTagPopup(!tagPopup);
  }

  function handleClose() {
    setModal({type: 0, pid: -1});
  }

  function handleAddTag() {
    console.log('does nothing for now');
    toggleTagPopup();
  }

  async function handlePost() {
    console.log('post');

    const titleElem = titleRef.current;
    const contentElem = contentRef.current;
    const username:string = user.username;
    const parent:(number | null) = null;

    if (!titleElem || !contentElem || !user.token) {return;}

    const title = titleElem.value;
    const content = contentElem.value;

    if (title === '' || content === '') {
      setErrorMessage('Error: Please add a title or post body');
      return;
    }

    const response = await fetch(apiBase + 'posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      },
      body: JSON.stringify({ title, content, username, parent })
    })
    const data = await response.json();
    console.log(data);

    // fetch posts?
    fetchPosts();

    handleClose();
  }

  async function handleEdit() {
    console.log('put');

    const titleElem = titleRef.current;
    const contentElem = contentRef.current;

    if (!currentPost || !titleElem || !contentElem || !user.token) {return;}

    const title = titleElem.value;
    const content = contentElem.value;

    if (title === '' || content === '') {
      setErrorMessage('Error: Please add a title or post body');
      return;
    }

    await fetch(apiBase + 'posts' + '/' + currentPost.pid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      },
      body: JSON.stringify({ post: currentPost.pid, title, content })
    })
    fetchPosts();

    handleClose();
  }

  return (
    <div className="modal">
      <img className="close-svg" src={close} onClick={handleClose}/>
      <div className="modal-container">
        {modal.type === 2 && <h1>Create post</h1>}
        {modal.type === 3 && <h1>Edit post</h1>}
      </div>
      <div className="modal-container input-container" >
        <input className="title-input" placeholder="Title" ref={titleRef}></input>
        
      </div>
      <div className="modal-container input-container" >
        <textarea className="content-input" placeholder="Body" ref={contentRef}/>
      </div>

      <div className="modal-container" >
        { tagPopup &&
          <div className="create-new-tag">
            <input placeholder="New tag"></input>
            <button onClick={toggleTagPopup}>Cancel</button>
            <button onClick={handleAddTag}>Confirm</button>
          </div>
        }

        <button className="tag-create" onClick={toggleTagPopup}>New &#43;</button>
        <button className="tag-selected">selected</button>
        <button className="tag-selected">at</button>
        <button className="tag-selected">start</button>
        <button className="tag">tag1</button>
        <button className="tag">tag two</button>
        <button className="tag">the third tag</button>
        <button className="tag">four</button>
      </div>

      <div className="create-edit-confirm-button-container">
        <p style={{color: 'red'}}>{errorMessage}</p>
        {modal.type === 2 && <button className="create-edit-confirm-button" onClick={handlePost}><h3>Post</h3></button>}
        {modal.type === 3 && <button className="create-edit-confirm-button" onClick={handleEdit}><h3>Confirm Changes</h3></button>}
      </div>
      

    </div>
  )
}