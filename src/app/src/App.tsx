import React, {useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { Register } from './features/auth/Register';
import MainPage from './features/pages/Main';
import { UserList } from './features/users/UserList';
import Profile from './features/profile/Profile';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import { selectors as authSelectors} from './features/auth/authSlice'
import { selectors as webSocketSelectors, actions as webSocketActions } from './features/pages/wsSlice';
import { selectors as profileSelectors } from './features/profile/profileSlice';

import './App.css';

const { selectProfile } = profileSelectors;
const { selectToken } = authSelectors;
const { selectSentStatus } = webSocketSelectors;
const { setStatusConnected } = webSocketActions;

const navStyle={
  borderBottom: 'solid 1px',
  paddingBottom: '1rem',
}

function App() {
  // React
  const [ws, setWs] = useState<WebSocket|undefined>(undefined);
  const [message, setMessage] = useState("development");
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const profile = useAppSelector(selectProfile);
  const wsStatus = useAppSelector<string>(selectSentStatus);
  
  const catchAll = () => {
    // * catch-all (from api)
    const pathSearch = window.location.search.split('?')[1]||undefined;
    if (pathSearch && pathSearch.startsWith('/')) {
      navigate(pathSearch);
    }
  }

  const handleWebSocket = () => {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    let host = window.location.host;
    console.log('-> ws')
    let _ws = new WebSocket('ws://' + host + '/');
    _ws.onerror = function() {
      navigate('/login')
    }
    _ws.onopen = function() {
      console.log('Websocket connection established');
      setWs(_ws);
      dispatch(setStatusConnected());
      if (window.location.pathname === '/login') navigate('/app');
    }
    _ws.onclose = function() {
      console.log('Websocket connection closed');
      setWs(undefined);
      if (window.location.pathname === '/logout') navigate('/login');
    }
    _ws.onmessage = function(ev) {
      setMessage(ev.data);
    }
  }
  
  useEffect(() => {
    catchAll();
    console.log(window.location.pathname)
    handleWebSocket();
  }, []);

  const authorized = token && token.length > 4;

  return (<>
  <div className='App'>
    <div className='App-Header'>
    <span>{`${wsStatus}`}</span>
    <div className="App-navigation">
      {authorized ? (
        <nav style={navStyle}>
          <Link className='App-link' to='/app/users'>Users</Link>
          <Link className='App-link' to='/app/logout'>Logout</Link>
          <span className='profile-picture-frame'>
            <Link className='App-link-profile' to='/app/profile'>
              <img 
                src={profile.avatar ? profile.avatar : '/user.png'} 
                width='42px'
                alt={profile.name}
              />
              {profile?.name?.split(' ').join("_")||""}
            </Link>
            <span id="ws-message">{message}</span>
          </span>
        </nav>
      ) :
        <nav style={navStyle}>
            <Link className='App-link' to="/login">Login</Link>
            <Link className='App-link' to="/register">Register</Link>
        </nav>
      }
    </div>
    <Routes>
      <Route path="/app" element={<MainPage ws={ws} />} />
      <Route path="/app/users" element={<UserList />} />
      <Route path="/app/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </div>
  </div>
  </>)
}

export default App;
