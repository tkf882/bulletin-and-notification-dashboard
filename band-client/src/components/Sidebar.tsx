import type { users } from '../types/users';
import type { posts } from '../types/posts';
import type { notifications } from '../types/notifications';

import { NotificationEntry } from './NotificationEntry';

import pfp from '../assets/pfp.jpg';
import bell from '../assets/bell.svg';
import close from '../assets/close-svg.svg';

import { useState, useEffect, useRef } from 'react';

import './Sidebar.css'

interface sidebarProps {
  setModal: (value: {type: number, pid: number}) => void;
  user: users;
  apiBase: string;
  postList: posts[];
}
export function Sidebar({setModal, user, apiBase, postList}:sidebarProps) {
  const [userPopup, setUserPopup] = useState(false);
  const [notificationPopup, setNotificationPopup] = useState(false);
  const notificationList = useRef<notifications[]>([]);
  const [unseenNotifications, setUnseenNotifications] = useState(0);
  const intervalIdRef= useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  // const unseenNotifications = useRef<number>(0);
  // let unseenNotifications:number = 0;

  useEffect(() => {
    fetchNotifications();
    if (notificationList.current) {
      let sum:number = 0;
      notificationList.current.forEach((notif) => {
        if (notif.seen === 0) {
          // unseenNotifications.current += 1;
          sum += 1;
        }
      })
      setUnseenNotifications(sum)
    }
    // console.log(`unseen is: ${unseenNotifications}`);

    intervalIdRef.current = setInterval(async () => {
      await fetchNotifications();
      if (notificationList.current) {
        let sum:number = 0;
        notificationList.current.forEach((notif) => {
          if (notif.seen === 0) {
            // unseenNotifications.current += 1;
            sum += 1;
          }
        })
        setUnseenNotifications(sum)
      }
      // if (unseenNotifications > 0) {
      //   fetchPosts();
      // }
      // console.log(`unseen is: ${unseenNotifications}`);
    }, 5000)

    return () => {
      console.log('return from sidebar useeffect');
      clearInterval(intervalIdRef.current);
    }
  });

  async function fetchNotifications() {
    if (user.token === null) {
      return;
    }

    const response = await fetch(apiBase + `notifications/`, {
      headers: { 'Authorization': user.token }
    })
    const notifData = await response.json();
    // console.log(notifData);

    notificationList.current = notifData;
  }

  async function updateNotifications(nid:number) {
    if (!user.token) {return;}

    await fetch(apiBase + 'notifications' + '/' + nid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user.token
      }
    })
  }

  function handleCreatePost() {
    setModal({type: 2, pid: -1});
  }

  function handleUserPopupToggle() {
    if (notificationPopup) {
      setNotificationPopup(!notificationPopup);
    }
    setUserPopup(!userPopup);
  }

  function handleNotificationPopupToggle() {
    if (userPopup) {
      setUserPopup(!userPopup);
    }
    setNotificationPopup(!notificationPopup);

    if (notificationList.current) {
      notificationList.current.forEach((notif) => {
        if (notif.seen === 0) {
          // console.log('updating')
          updateNotifications(notif.nid);
        }
      })
    }
    // unseenNotifications.current = 0;
    setUnseenNotifications(0);
  }

  function handleSignOut() {
    localStorage.removeItem('userInfo');
    setUserPopup(false);
    location.reload();
  }

  // Title updated here.
  return (
    <div className="sidebar">
      <title>{unseenNotifications > 0 && `(${unseenNotifications})`} B&ND - Bulletin & Notification Dashboard</title>
      <div className="sidebar-top">

        {userPopup && 
          <div className="profile-popup">
            <img className="close-svg-sidebar" onClick={handleUserPopupToggle} src={close}/>
            <img className="profile-picture-popup" src={pfp}/>
            <h2>{user.username}</h2>
            <button className="profile-popup-button" onClick={handleSignOut}>Sign out</button>
          </div>
        }

        {notificationPopup && 
          <div className="notification-popup">
            {
              notificationList.current.map((notif) => {
                return <NotificationEntry key={notif.nid} notif={notif} postList={postList}/>
              })
            }
            {
              notificationList.current.length === 0 && <p>No notifications.</p>
            }
          </div>
        }
        <div className="notification-bell-container">
          {unseenNotifications > 0 && <div className="notification-number">{unseenNotifications}</div>}
          <img className="sidebar-svg" src={bell} onClick={handleNotificationPopupToggle}/>
        </div>
        
        <img className="profile-picture" src={pfp} onClick={handleUserPopupToggle}/>
      </div>
      <div className="sidebar-user-actions">
        <button className="create-button" onClick={handleCreatePost}><h3>Create</h3></button>
      </div>

    </div>
  )
}