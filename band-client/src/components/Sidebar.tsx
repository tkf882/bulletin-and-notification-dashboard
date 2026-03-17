import pfp from '../assets/pfp.jpg';
import bell from '../assets/bell.svg';
import close from '../assets/close-svg.svg';

import './Sidebar.css'

export function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">

        {/* <div className="profile-popup">
          <img className="close-svg-sidebar" src={close}/>
          <img className="profile-picture-popup" src={pfp}/>
          <h2>1234567890123456</h2>
          <button className="profile-popup-button">Sign out</button>
        </div> */}

        <img className="sidebar-svg" src={bell}/>
        <img className="profile-picture" src={pfp}/>
      </div>
      <div className="sidebar-user-actions">
        <button className="create-button"><h3>Create</h3></button>
      </div>

    </div>
  )
}