import React, { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import { io } from "socket.io-client";

import { Register } from './features/auth/Register';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { UserList } from './features/users/UserList';
import Pages from './features/pages';
import { Thread } from './features/thread';
import About from './features/pages/About';
import Profile from './features/profile/Profile';
import Navigation from './features/menu/Navigation';
import ConnectRequests from './features/social/Requests';
import SocketTest from './features/network/SocketTest';

import { selectors as profileSelectors } from './features/profile/profileSlice';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import { Container } from 'reactstrap';

import handleIO from './features/network/config';

import './App.css';

const socket = io(window.location.origin, { withCredentials: true });
const { selectProfile } = profileSelectors;


function App() {
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  useEffect(() => {
    handleIO(socket, dispatch, profile, navigate);
  }, []);

  return (<ErrorBoundary>
    <div className='App'>
      <Navigation />
    </div>
    <Container>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app/test" element={<SocketTest socket={socket} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<Pages.MainPage ws={socket} />} />
        <Route path="/app/users" element={<UserList />} />
        <Route path="/app/profile" element={<Profile />} />
        <Route path="/app/logout" element={<Logout socket={socket} />} />
        <Route path="/app/requests" element={<ConnectRequests />} />
        <Route path="/app/thread/:thread_id" element={<Thread />} />
        <Route path="/" element={<Pages.Welcome ws={socket} />} />
      </Routes>
    </Container>
  </ErrorBoundary>)
}

export default App;
