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
import { selectors as webSocketSelectors, actions as webSocketActions } from './features/pages/wsSlice';
import Posts from './features/posts/Posts';
import './App.css';

import { io } from "socket.io-client";

const {setStatusConnected, setStatusDisconnected} = webSocketActions;

const socket = io();

socket.on("connect", () => {
  console.log("connected");
  useAppDispatch()(setStatusConnected());  
  // save to Redux
});

socket.on("disconnect", () => {
  console.log("disconnected")
  // remove from Redux
  useAppDispatch()(setStatusDisconnected());  
});

socket.on("message", (data) => {
  console.log(data);
})

const { selectSentStatus } = webSocketSelectors;

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

  useEffect(() => {
    catchAll();
  }, []);

  return (<ErrorBoundary>
    <div className='App'>
      <Navigation />
    </div>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<Pages.MainPage ws={socket} />} />
          <Route path="/app/users" element={<UserList />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/app/logout" element={<Logout />} />
          <Route path="/app/requests" element={<ConnectRequests />} />
          <Route path="/app/thread/:thread_id" element={<Posts />} />
          <Route path="/" element={<Pages.Welcome ws={socket} />} />
        </Routes>
      </Container>
      
      {/* <span id="ws-message">{wsStatus} [{message}]</span> */}

  </ErrorBoundary>)
}

export default App;
