import close from '../../assets/close-svg.svg';

import './CreateEditPost.css'
import './modal.css'


interface createEditPostProps {
  modal: {type: number, pid: number};
  setModal: (value: {type: number, pid: number}) => void;
}
export function CreateEditPost({modal, setModal}:createEditPostProps) {

  function handleClose() {
    setModal({type: 0, pid: -1});
  }

  return (
    <div className="modal">
      <img className="close-svg" src={close} onClick={handleClose}/>
      <div className="modal-container" >
        <h1>Create post</h1>
        <h1>Edit post</h1>
      </div>
      <div className="modal-container input-container" >
        <input className="title-input" placeholder="Title"></input>
        
      </div>
      <div className="modal-container input-container" >
        <textarea className="content-input"/>
        
      </div>

      <div className="modal-container" >
        <div className="create-new-tag">
          <input placeholder="New tag"></input>
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
        <button className="tag-create">New &#43;</button>
        <button className="tag-selected">selected</button>
        <button className="tag-selected">at</button>
        <button className="tag-selected">start</button>
        <button className="tag">tag1</button>
        <button className="tag">tag two</button>
        <button className="tag">the third tag</button>
        <button className="tag">four</button>
      </div>

      <div className="confirm-button-container">
        <button className="confirm-button"><h3>Post</h3></button>
        <button className="confirm-button"><h3>Confirm Changes</h3></button>
      </div>
      

    </div>
  )
}