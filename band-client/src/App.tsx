import { PostGrid } from './components/PostGrid';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

import { ViewPost } from './components/modal/ViewPost';
import { CreateEditPost } from './components/modal/CreateEditPost';

import { useState } from 'react'

import './App.css'

function App() {
  const [signedIn, setSignedIn] = useState(true);

  // setSignedIn(true);

  if (!signedIn) {
    return (
      <>
        <Header/>
        <div className="welcome-container">
          {/* <h1>Welcome.</h1> */}
          <h1>Log in.</h1>
          {/* <h1>Sign up.</h1> */}

          {/* <button className="welcome-button">Sign up</button> */}
          {/* <button className="welcome-button">Log in</button> */}

          <div>
            <p className="welcome-text">Username</p>
            <input className="welcome-input" placeholder="username"></input>
            <p className="welcome-text">Password</p>
            <input className="welcome-input" type="password"></input>
          </div>
          <div>
            <button className="welcome-button">Cancel</button> 

            <button className="welcome-button">Log in</button> 
            {/* <button className="welcome-button">Sign up</button>  */}
          </div>


        </div>

      </>
    )
  }

  return (
    <>
      {/* <div className="overlay">
        <CreateEditPost/>
      </div> */}

      {/* <div className="overlay">
        <ViewPost/>
      </div> */}

      

      <Header/>

      <Sidebar/>

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


        <PostGrid />
        
      </div>

    </>
  )
}

export default App
