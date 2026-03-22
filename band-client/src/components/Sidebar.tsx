import type { users } from '../types/users';

import pfp from '../assets/pfp.jpg';
import bell from '../assets/bell.svg';
import close from '../assets/close-svg.svg';

import { useState } from 'react';

import './Sidebar.css'

interface sidebarProps {
  setModal: (value: {type: number, pid: number}) => void;
  user: users;
}
export function Sidebar({setModal, user}:sidebarProps) {
  const [popup, setPopup] = useState(false);

  function handleCreatePost() {
    setModal({type: 2, pid: -1});
  }

  function handlePopupToggle() {
    setPopup(!popup);
  }

  function handleSignOut() {
    localStorage.removeItem('userInfo');
    setPopup(false);
    location.reload();
  }

  return (
    <div className="sidebar">
      <div className="sidebar-top">

        {popup && 
          <div className="profile-popup">
            <img className="close-svg-sidebar" onClick={handlePopupToggle} src={close}/>
            <img className="profile-picture-popup" src={pfp}/>
            <h2>{user.username}</h2>
            <button className="profile-popup-button" onClick={handleSignOut}>Sign out</button>
          </div>
        }



        <img className="sidebar-svg" src={bell}/>
        <img className="profile-picture" src={pfp} onClick={handlePopupToggle}/>
      </div>
      <div className="sidebar-user-actions">
        <button className="create-button" onClick={handleCreatePost}><h3>Create</h3></button>
      </div>

    </div>
  )
}