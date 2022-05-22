import React, { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import { io } from "socket.io-client";

import { Register } from './features/auth/Register';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { UserList } from './features/users/UserList';
import { Thread } from './features/thread';
import Pages from './features/pages';
import About from './features/pages/About';
import Profile from './features/profile/Profile';
import Navigation from './features/menu/Navigation';
import ConnectRequests from './features/social/Requests';

import { selectors as profileSelectors } from './features/profile/profileSlice';
import { useAppSelector, useAppDispatch } from './memory/hooks';


import handleIO from './features/network/config';
import SocketTest from './features/network/SocketTest';

import './App.css';

const socket = io(window.location.origin, { withCredentials: true });
const { selectProfile } = profileSelectors;

function App() {
  // Real Time Connection?, (toggle)
  const [rtc, toggleRTC] = useState(true); // start connected.
  const connectIt = rtc && socket;
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  useEffect(() => {
    if (rtc) {
      socket.connect();
      handleIO(socket, dispatch, profile, navigate);
    } else {
      socket.disconnect();
    }
  }, [rtc]);


  return (<ErrorBoundary>
    <div className='App'>
      <Navigation toggleRTC={()=> toggleRTC(!rtc)} />
    </div>
    <Container>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app/test" element={<SocketTest socket={connectIt} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<Pages.MainPage ws={connectIt} />} />
        <Route path="/app/users" element={<UserList socket={connectIt} />} />
        <Route path="/app/profile" element={<Profile />} />
        <Route path="/app/logout" element={<Logout socket={connectIt} />} />
        <Route path="/app/requests" element={<ConnectRequests />} />
        <Route path="/app/thread/:thread_id" element={<Thread socket={connectIt} />} />
        <Route path="/" element={<Pages.Welcome ws={connectIt} />} />
      </Routes>
    </Container>
  </ErrorBoundary>)
}

export default App;
