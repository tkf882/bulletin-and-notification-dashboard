import { Comment } from './Comment';
import type { posts } from '../../types/posts';
import type { users } from '../../types/users';

import { useState, useRef, useEffect } from 'react'

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
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const commentList = useRef([]);
  // let commentList:posts[] = [];
  // const [commentList, setCommentList] = useState([]); // update when changed
  const commentContentRef = useRef<any>(null);
  let tags:string[] = [];

  let currentPost:(posts | null) = null;
  postList.forEach((post) => {
    if (post.pid === modal.pid) {
      currentPost = post;
    }
  });

  if (currentPost) {
    const tagList:string = currentPost['tags'];
    tags = tagList.split(",")
    // console.log(tags);
  }



  useEffect(() => {
    fetchComments();
  }, [])

  async function fetchComments() {
    setIsLoading(true);
    if (user.token === null || !currentPost) {
      return;
    }

    const response = await fetch(apiBase + `posts/comments/${currentPost.pid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      }
    })
    const commentsData = await response.json();

    commentList.current = commentsData;
    // commentList = commentsData;
    // setCommentList(commentsData);
    // console.log('comment list from fetchComments():')
    // console.log(commentList);
    setIsLoading(false);
  }

  function handleClose() {
    setModal({type: 0, pid: -1});
  }

  function handleEdit() {
    if (!currentPost) {return;}
    setModal({type: 3, pid: currentPost.pid});
  }

  async function handlePostComment() {
    // console.log('create a comment');
    const commentElem = commentContentRef.current;

    if (!commentElem || !user.token || !currentPost) {return;}

    const content = commentElem.value;
    const parent:(number | null) = currentPost.pid;

    if (content === '') {
      setErrorMessage('Error: Please enter text into comment box');
      return;
    }

    const response = await fetch(apiBase + 'posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      },
      body: JSON.stringify({ title:'', content, username:user.username, parent, tagString:'' })
    })
    const data = await response.json();
    console.log(data);

    commentElem.value = '';
    setErrorMessage('');

    await fetchComments();
  }

  async function handleDelete() {
    // console.log('delete the post');

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
        {
          tags.map((t) => {
            if (t !== '') {
              return <button key={t} className="tag modal-tag">{t}</button>
            }
            
          })
        }
      </div>
      <div className="modal-container">
        <h2>Comments</h2>
          <textarea className="comment-input" placeholder="Add comment" ref={commentContentRef}></textarea>
          <button className="view-post-button" onClick={handlePostComment}>Submit</button>
          <p style={{color: 'red'}}>{errorMessage}</p>

          {
            isLoading 
            ? <p>Loading comments...</p>
            : 
              commentList.current.map((com) => {
                // console.log(`comment ${com}`)
                return <Comment key={com['pid']} com={com}/>
              })
          }

          {/* {
            commentList.current.map((com) => {
              console.log(`comment ${com}`)
              return <Comment key={com['pid']} com={com}/>
            })
          } */}


      </div>
    
    </div>
  )
}