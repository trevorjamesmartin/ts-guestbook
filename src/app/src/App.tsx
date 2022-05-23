import React, { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';

import { io, Socket } from "socket.io-client";

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

import { selectors as authSelectors } from './features/auth/authSlice';
import { selectors as socketSelectors } from './features/network/socketSlice';
import { selectors as profileSelectors } from './features/profile/profileSlice';
import { useAppSelector, useAppDispatch } from './memory/hooks';

import handleIO, { AppEventsMap } from './features/network/config';
import SocketTest from './features/network/SocketTest';

import './App.css';
const { selectToken } = authSelectors;


// socket.disconnect();

const { selectProfile } = profileSelectors;
const { selectStatus: selectSocketStatus } = socketSelectors;

function App() {
  const [localSocket, setSocket] = useState<Socket<AppEventsMap, AppEventsMap> | undefined>(undefined);
  // Real Time Connection?, (toggle)
  const [rtc, toggleRTC] = useState(true); // start connected.
  const connectIt = rtc && localSocket;
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const token = useAppSelector(selectToken);
  const ioStatus = useAppSelector(selectSocketStatus);

  useEffect(() => {
    if (token && !localSocket) {
      console.log('[io] create initial connection')
      let socket = io(process.env.REACT_APP_BASE_URL || window.location.origin, {
        withCredentials: true,
        auth: { token }
      });
      handleIO(socket, dispatch, profile, token, navigate);
      setSocket(socket); // save localSocket
      return
    }
  }, [token]);

  useEffect(() => {
    if (rtc) {
      console.log('(connect)')
      localSocket?.connect();
    } else {
      console.log('(disconnect)')
      localSocket?.disconnect();
    }
  }, [rtc])

  return (<ErrorBoundary>
    <div className='App'>
      <Navigation toggleRTC={() => toggleRTC(!rtc)} />
      <p>io: {ioStatus}</p>
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
