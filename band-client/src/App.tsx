import { PostGrid } from './components/PostGrid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

import { ViewPost } from './components/modal/ViewPost';
import { CreateEditPost } from './components/modal/CreateEditPost';

import { useState, useRef, useEffect } from 'react'
// import type { posts } from './types/posts.ts';
import type { users } from './types/users.ts';

import './App.css'

function App() {
  // let user:users = {
  //   token: localStorage.getItem('token'),
  //   uid: Number(localStorage.getItem('uid') || -1),
  //   username: localStorage.getItem('username')
  // }
  const userLocal = localStorage.getItem('userInfo');
  let user:users = userLocal ? JSON.parse(userLocal) : {token: null, uid: -1, username: ''};
  // console.log(user);

  // let token = localStorage.getItem('token');
  // let uid:number = Number(localStorage.getItem('uid') || -1);
  // let uid = useRef(-1);

  // let posts:posts[] = [];
  const posts = useRef([]);

  // const apiBase = '/'
  const apiBase = 'http://localhost:5000/'

  // const [token, setToken] = useState(localStorage.getItem('token'));
  const [isRegistration, setIsRegistration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({type: 0, pid: -1}); // 0: none, 1: view post, 2: create post, 3: edit post

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);


  // const isLoading = useRef(false);
  // const isAuthenticating = useRef(false);

  useEffect(() => {
    // token = localStorage.getItem('token');
    // setToken(localStorage.getItem('token'));
    fetchPosts();
  }, [])

  function handleToggleRegister() {
    setIsRegistration(!isRegistration);
  }

  async function fetchPosts() {
    setIsLoading(true);
    if (user.token === null) {
      setIsLoading(false);
      return;
    }
    console.log(`Fetching posts with token: ${user.token}`)
    // console.log(`uid is ${uid.current}`);
    const response = await fetch(apiBase + 'posts', {
      headers: { 'Authorization': user.token }
    })
    const postsData = await response.json();

    posts.current = postsData;
    console.log(posts);
    setIsLoading(false);
  }

  async function handleAuthenticate() {
    console.log('authenticate');

    //
    // Error Handling
    //
    if (isLoading) {
      return;
    }

    const usernameElement = usernameRef.current;
    const passwordElement = passwordRef.current;

    if (!usernameElement || !passwordElement) {
      setErrorMessage('Error: Something went wrong...');
      return;
    }

    const usernameString:string = usernameElement['value'];
    const passwordString:string = passwordElement['value'];

    
    if (isRegistration) {
      // Username checks
      if (usernameString.includes(' ')) {
        setErrorMessage('Username Error: Invalid character (no spaces)');
        return;
      } else if (usernameString.length < 3) {
        setErrorMessage('Username Error: Username too short (must be at least 3 characters)');
        return;
      } else if (usernameString.length > 15) {
        setErrorMessage('Username Error: Username too long (maximum 15 characters)');
        return;
      }

      // password checks
      if (passwordString.includes(' ')) {
        setErrorMessage('Password Error: Invalid character (no spaces)');
        return;
      } else if (passwordString.length < 8) {
        setErrorMessage('Password Error: Password too short (must be at least 8 characters)');
        return;
      } else if (passwordString.length > 48) {
        setErrorMessage('Password Error: Password too long (maximum 48 characters)');
        return;
      }
    }

    //
    // Authenticate
    //
    setErrorMessage('');

    try {
      let data;
      // TODO: Hash the password here? 
      if (isRegistration) {
        // Register
        const response = await fetch(apiBase + 'auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameString, password: passwordString })
        })
        data = await response.json()
      } else {
        // Log in
        const response = await fetch(apiBase + 'auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameString, password: passwordString })
        })
        data = await response.json()
        console.log('logging in with:')
        console.log(data);
      }
      
      if (data.token) {
        // setToken(data.token);
        user.token = data.token;
        user.uid = data.uid;
        user.username = data.username;

        localStorage.setItem('userInfo', JSON.stringify({
          token: data.token,
          uid: data.uid,
          username: data.username
        }));



        // localStorage.setItem('token', data.token);
        // localStorage.setItem('uid', data.uid);
        // localStorage.setItem('username', data.username);

        // setIsLoading(true);
        // console.log(token);
        // console.log(uid);
        await fetchPosts();

      } else {
        throw new Error(`Authentication error: ${data.message}`);
        // throw new Error('Failed to authenticate.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message)
        setErrorMessage(err.message);
        return;
      }
    } finally {
      // setIsLoading(false);
      // setErrorMessage('');
    }
  }

  if (user.token) {
    // console.log(token);
    
    // fetchPosts();
    // console.log(posts);

    return (
      <>

        {
          modal.type === 1 &&
          <div className="overlay">
            <ViewPost
              modal={modal}
              setModal={setModal}
              postList={posts.current}
              user={user}
              apiBase={apiBase}
              fetchPosts={fetchPosts}
            />
          </div>
        }

        {
          (modal.type === 2 || modal.type === 3) &&
          <div className="overlay">
            <CreateEditPost
              modal={modal}
              setModal={setModal}
              postList={posts.current}
              apiBase={apiBase}
              user={user}
              fetchPosts={fetchPosts}
            />
          </div>
        }

        <Header/>

        <Sidebar
          setModal={setModal}
          user={user}
        />

        <div className="main-content">
          <h1 className="main-content-header">Posts</h1>
          <div>
            <select className="main-content-select">
              <option>Date (Descending)</option>
              <option>Date (Ascending)</option>
              <option>Title (Descending)</option>
              <option>Title (Ascending)</option>
            </select>
            <input className="main-search" placeholder="Search"></input>
            <button className="tag">Open</button>
            <button className="tag">Closed</button>
          </div>
          <div className="tags-container">
            <button className="tag-selected">selected</button>
            <button className="tag-selected">at</button>
            <button className="tag-selected">start</button>
            <button className="tag">tag1</button>
            <button className="tag">tag two</button>
            <button className="tag">the third tag</button>
            <button className="tag">four</button>
            
          </div>


          <PostGrid 
            posts={posts.current}
            setModal={setModal}
          />
          
        </div>

      </>
    )
  }

  return (
    <>
      <Header/>
      <div className="welcome-container">
        <h1>{isRegistration ? 'Sign up!' : 'Log in!'}</h1>

        <div>
          <p className="welcome-text">Username</p>
          <input className="welcome-input" placeholder="username" ref={usernameRef}></input>
          <p className="welcome-text">Password</p>
          <input className="welcome-input" placeholder="********" type="password" ref={passwordRef}></input>
        </div>
        <p style={{color: 'red'}}>{errorMessage}</p>
        <p>{isLoading ? 'Loading...' : ''}</p>
        <div style={{marginBottom: '30px'}}>
          <button className="welcome-button" 
            onClick={handleAuthenticate}>{isRegistration ? 'Sign up' : 'Log in'}</button> 
        </div>

        <h2>{!isRegistration ? 'Don\'t have an account?' : 'Already have an account?'}</h2>
        <button className="welcome-button" onClick={handleToggleRegister}>
          {!isRegistration ? 'Sign up' : 'Log in'}
        </button>


      </div>

    </>
  )
















}

export default App

// References:
// 1: https://github.com/jamezmca/backend-full-course