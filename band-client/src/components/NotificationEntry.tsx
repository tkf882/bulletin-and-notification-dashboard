import type { notifications } from '../types/notifications';
import type { posts } from '../types/posts';

import './NotificationEntry.css';

interface notificationEntryProps {
  notif: notifications;
  postList: posts[];
}

export function NotificationEntry({notif, postList}:notificationEntryProps) {
  // let contentPost:(posts | null) = null;
  // let post:(posts | null) = null;
  let username:string = '';
  let postTitle:string = '';

  postList.forEach((p) => {
    if (p.pid === notif.content_post_id) {
      username = p.username;
    }
    if (p.pid === notif.post_id) {
      postTitle = p.title;
    }
  });


  return(
    <div className={`notification ${notif.seen === 1 && 'seen'}`}>
      <p>{notif.date}</p>
      <p>{notif.message}</p>
      {/* <p><span style={{fontWeight:'700'}}>{username}</span> commented on your post <span style={{fontWeight:'700'}}>{`"${postTitle}"`}</span></p> */}
    </div>
  )
}