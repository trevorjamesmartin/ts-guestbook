import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import ErrorBoundary from './ErrorBoundary';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { Register } from './features/auth/Register';
import Pages from './features/pages';

import { UserList } from './features/users/UserList';
import Profile from './features/profile/Profile';
import Navigation from './features/menu/Navigation';

import ConnectRequests from './features/social/Requests';

import { useAppSelector, useAppDispatch } from './memory/hooks';
// import { selectors as authSelectors } from './features/auth/authSlice'
// const { selectToken } = authSelectors;

import { selectors as webSocketSelectors, actions as webSocketActions } from './features/pages/wsSlice';
// import { selectors as profileSelectors } from './features/profile/profileSlice';

import './App.css';

// const { selectProfile } = profileSelectors;
// const { selectToken } = authSelectors;
const { selectSentStatus } = webSocketSelectors;
const { setStatusConnected } = webSocketActions;

function App() {
  // React
  const [ws, setWs] = useState<WebSocket | undefined>(undefined);
  const [message, setMessage] = useState("");
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();

  const wsStatus = useAppSelector<string>(selectSentStatus);

  const catchAll = () => {
    // * catch-all (from api)
    const pathSearch = window.location.search.split('?')[1] || undefined;
    if (pathSearch && pathSearch.startsWith('/')) {
      navigate(pathSearch);
    }
  }

  const handleWebSocket = () => {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    console.log('-> ws')
    let local_url: string = window.location.protocol + "://" + window.location.host
    let base_url: string = process.env.REACT_APP_BASE_URL || local_url;
    let ws_url: string = `ws://${base_url.split('://')[1]}`;
    let _ws = new WebSocket(ws_url);
    _ws.onerror = function () {
      navigate('/login')
    }
    _ws.onopen = function () {
      console.log('Websocket connection established');
      setWs(_ws);
      dispatch(setStatusConnected());
      if (window.location.pathname === '/login') navigate('/app');
    }
    _ws.onclose = function () {
      console.log('Websocket connection closed');
      setWs(undefined);
      navigate('/login');
    }
    _ws.onmessage = function (ev) {
      setMessage(ev.data);
    }
  }

  useEffect(() => {
    catchAll();
    console.log(window.location.pathname)
    handleWebSocket();
  }, []);


  return (<ErrorBoundary>
    <div className='App'>
      <Navigation />
    </div>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<Pages.MainPage ws={ws} />} />
          <Route path="/app/users" element={<UserList />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/logout" element={<Logout />} />
          <Route path="/app/requests" element={<ConnectRequests />} />
          <Route path="/" element={<Pages.Welcome ws={ws} />} />
        </Routes>
      </Container>
      
      {/* <span id="ws-message">{wsStatus} [{message}]</span> */}

  </ErrorBoundary>)
}

export default App;
