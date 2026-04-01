import { PostGrid } from './components/PostGrid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Tag } from './components/Tag';

import { ViewPost } from './components/modal/ViewPost';
import { CreateEditPost } from './components/modal/CreateEditPost';

import { useState, useRef, useEffect } from 'react'
import type { posts } from './types/posts.ts';
import type { users } from './types/users.ts';
// import type { tags } from './types/tags.ts';
import type { tagFormat } from './types/tagFormat.ts';

import './App.css'


function App() {
  // let user:users = {
  //   token: localStorage.getItem('token'),
  //   uid: Number(localStorage.getItem('uid') || -1),
  //   username: localStorage.getItem('username')
  // }
  const userLocal = localStorage.getItem('userInfo');
  let user: users = userLocal ? JSON.parse(userLocal) : { token: null, uid: -1, username: '' };
  console.log(`token: ${user.token}`);

  const posts = useRef<posts[]>([]);
  // const [posts, setPosts] = useState<posts[]>([]);
  // const tags = useRef<tagFormat[]>([]); // {{tid:number, tag:string}, selected:boolean}
  const [tags, setTags] = useState<tagFormat[]>([]);

  const apiBase = 'http://localhost:5000/';
  // const apiBase = 'http://192.168.1.94:5000/';

  const [isRegistration, setIsRegistration] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ type: 0, pid: -1 }); // 0: none, 1: view post, 2: create post, 3: edit post
  const [search, setSearch] = useState('');
  // const [sort, setSort] = useState(0); // 0: Date (Desc), 1: Date (Asc), 2: Title (Desc), 3: Title (Asc)
  const sortRef = useRef<any>(null);
  const searchRef = useRef<any>(null);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    // token = localStorage.getItem('token');
    // setToken(localStorage.getItem('token'));
    fetchPosts();
    fetchTags();

    // intervalIdRef.current = setInterval(async () => {
    //   fetchPosts();
    //   // fetchTags();
    // }, 5000)

    return () => {
      console.log('return from app useeffect');
      clearInterval(intervalIdRef.current);
    }
  }, [])

  // fix async: Dont need fetch functions in other components. Refresh page after authentication valid to activate this use effect again
  // https://devtrium.com/posts/async-functions-useeffect
  // https://legacy.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies


  async function fetchPosts() {
    setIsLoading(true);
    // console.log(sortRef.current);

    console.log('Fetching posts.')

    if (user.token === null) {
      setIsLoading(false);
      return;
    }

    let mostRecentPID: number = -1;
    // Depending on the sort order, the first entry in posts may not be the most recent.
    // posts.current.forEach((post) => {
    //   if (post.pid > mostRecentPID) {
    //     mostRecentPID = post.pid;
    //   }
    // })

    // console.log(`posts/${sortRef.current ? sortRef.current : 0}/${mostRecentPID}`);
    const url: string = `${apiBase}posts/all?pid=${mostRecentPID}&sort=${sortRef.current ? sortRef.current : 0}`;
    console.log(url)
    const response = await fetch(url, {
      headers: { 'Authorization': user.token }
    })
    const postsData = await response.json();
    console.log('posts data')
    console.log(postsData);

    posts.current = postsData;

    // console.log(posts);
    setIsLoading(false);
  }

  async function fetchTags() {
    setIsLoading(true);
    if (user.token === null) {
      setIsLoading(false);
      return;
    }
    // console.log(`Fetching tags with token: ${user.token}`)
    const response = await fetch(apiBase + 'tags', {
      headers: { 'Authorization': user.token }
    })
    const tagsData = await response.json();

    const newTags: tagFormat[] = [];

    tagsData.forEach((tag: any) => {
      newTags.push({ tag: tag, selected: false })
    })

    // tags.current = newTags.slice();
    setTags(structuredClone(newTags));
    // console.log(tags);
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

    const usernameString: string = usernameElement['value'];
    const passwordString: string = passwordElement['value'];


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
        // console.log('logging in with:')
        // console.log(data);
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

        await fetchPosts();
        await fetchTags();

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

  function handleSearchInput(event: any) {
    setSearch(event.target.value);
  }

  function handleToggleRegister() {
    setIsRegistration(!isRegistration);
  }

  async function handleSetSort(sort: number) {
    // setSort(sort);
    sortRef.current = sort;
    await fetchPosts();
  }

  if (user.token) {
    // console.log(token);
    if (isLoading) {
      return (
        <>
          <Header />
          <div className="welcome-container">
            <h1>Loading...</h1>
          </div>
        </>
      )
    }

    return (
      <>
        <title>B&ND - Bulletin & Notification Dashboard</title>
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
              fetchTags={fetchTags}
              tags={tags}
            />
          </div>
        }

        <Header />

        <Sidebar
          setModal={setModal}
          user={user}
          apiBase={apiBase}
          postList={posts.current}
        />

        <div className="main-content">
          <h1 className="main-content-header">Posts</h1>
          <div>
            <select className="main-content-select" defaultValue={sortRef.current || "0"}>
              <option onClick={() => { handleSetSort(0) }} value="0">Date (Descending)</option>
              <option onClick={() => { handleSetSort(1) }} value="1">Date (Ascending)</option>
              <option onClick={() => { handleSetSort(2) }} value="2">Title (Descending)</option>
              <option onClick={() => { handleSetSort(3) }} value="3">Title (Ascending)</option>
            </select>
            <input className="main-search" placeholder="Search" ref={searchRef} onChange={handleSearchInput} value={search}></input>
            <button className="tag">Open</button>
            <button className="tag">Closed</button>
          </div>
          <div className="tags-container">
            {
              tags.map((tagEntry) => {
                return <Tag key={tagEntry.tag.tid} tags={tags} setTags={setTags} tagEntry={tagEntry} />
              })
            }
          </div>


          <PostGrid
            posts={posts.current}
            setModal={setModal}
            search={search}
            tags={tags}
          />

        </div>

      </>
    )
  }

  return (
    <>
      <Header />
      <div className="welcome-container">
        <h1>{isRegistration ? 'Sign up!' : 'Log in!'}</h1>

        <div>
          <p className="welcome-text">Username</p>
          <input className="welcome-input" placeholder="username" ref={usernameRef}></input>
          <p className="welcome-text">Password</p>
          <input className="welcome-input" placeholder="********" type="password" ref={passwordRef}></input>
        </div>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <p>{isLoading ? 'Loading...' : ''}</p>
        <div style={{ marginBottom: '30px' }}>
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
