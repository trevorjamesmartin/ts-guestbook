import React, {useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import MainPage from './features/pages/Main';
import { UserList } from './features/users/UserList';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import { selectors as authSelectors} from './features/auth/authSlice'
import { selectors as webSocketSelectors, actions as webSocketActions } from './features/pages/wsSlice';
import './App.css';

const { selectLoggedIn } = authSelectors;
const { selectSentStatus } = webSocketSelectors;
const { setStatusConnected } = webSocketActions;

const navStyle={
  borderBottom: 'solid 1px',
  paddingBottom: '1rem',
}

function App() {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const loggedIn = useAppSelector(selectLoggedIn);
  const [ws, setWs] = useState<WebSocket|undefined>(undefined);
  const wsStatus = useAppSelector<string>(selectSentStatus);
  
  const catchAll = () => {
    // * catch-all (from api)
    const pathSearch = window.location.search.split('?')[1]||undefined;
    if (pathSearch && pathSearch.startsWith('/')) {
      navigate(pathSearch);
    }
  }
  
  useEffect(() => {
    catchAll();
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    let host = window.location.host;
    console.log('-> ws')
    let _ws = new WebSocket('ws://' + host);
    _ws.onerror = function() {
      // console.log('Websocket error');
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
      // console.log(ev.data)
      setMessage(ev.data);
    }
  }, []);

  return (<>
  <div className='App'>
    <div className='App-Header'>
    <h1>App</h1>
    <span>{wsStatus}</span>
    <div className="App-navigation">
      {loggedIn ? (
        <nav style={navStyle}>
          <Link className='App-link' to='/app/users'>Users</Link>
          <Link className='App-link' to='/app/logout'>Logout</Link>
        </nav>
      ) :
        <nav style={navStyle}>
            <Link className='App-link' to="/login">Login</Link>
            <Link className='App-link' to="/register">Register</Link>
        </nav>
      }
    </div>
    <span id="ws-message">{message}</span>
    <Routes>
      <Route path="/app" element={<MainPage ws={ws} />} />
      <Route path="/app/users" element={<UserList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app/logout" element={<Logout />} />
      <Route path="/register" element="[registration form]" />
    </Routes>
    </div>
  </div>
  </>)
}

export default App;
