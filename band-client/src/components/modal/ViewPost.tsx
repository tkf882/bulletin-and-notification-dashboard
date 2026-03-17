import { Comment } from './Comment';

import close from '../../assets/close-svg.svg';

import './ViewPost.css'
import './modal.css'

export function ViewPost() {
  return (
    <div className="modal">
      <img className="close-svg" src={close}/>
      <div className="modal-container" >
        <button className="tag modal-tag">Open</button>
        <button className="tag-create">Mark as Closed</button>
        <h1>Title</h1>
        <h2>username . 03 09 2026</h2>
        <p>this is the post description. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore earum eaque sed quis! Inventore, delectus officiis vitae ullam in facilis cumque rerum fugit tempora dolore saepe molestiae neque ex dolores. delectus officiis vitae ullam in facilis cumque rerum fugit tempora dolore saepe molestiae neque ex dolores. delectus officiis vitae ullam in facilis cumque rerum fugit tempora dolore saepe molestiae neque ex dolores.</p>
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