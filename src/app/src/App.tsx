import React, { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import { io } from "socket.io-client";

import { Register } from './features/auth/Register';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { UserList } from './features/users/UserList';
import Pages from './features/pages';
import Posts from './features/posts/Posts';
import Profile from './features/profile/Profile';
import Navigation from './features/menu/Navigation';
import ConnectRequests from './features/social/Requests';

import { useAppSelector, useAppDispatch } from './memory/hooks';
import { selectors as profileSelectors } from './features/profile/profileSlice';
import { getFeedAsync } from './features/feed/feedSlice';
import { actions as webSocketActions } from './features/network/socketSlice';

import { Container } from 'reactstrap';
import './App.css';

const socket = io(window.location.origin, { withCredentials: true });
const { setStatusConnected, setStatusDisconnected } = webSocketActions;
const { selectProfile } = profileSelectors;

function App() {
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);

  const catchAll = () => {
    // * catch-all (from api)
    const pathSearch = window.location.search.split('?')[1] || undefined;
    if (pathSearch && pathSearch.startsWith('/')) {
      navigate(pathSearch);
    }
  }

  const handleIO = () => {
    // socket events are declared within the component, 
    // because hooks (dispatch) update the store.

    socket.on("connect", () => {
      console.log("connected");
      dispatch(setStatusConnected(socket, `hello:${profile.username}`));
      // save to Redux
    });

    socket.on("disconnect", () => {
      console.log("disconnected")
      // remove from Redux
      dispatch(setStatusDisconnected(socket, `goodbye:${profile.username}`));
    });

    socket.on("message", (data) => {
      console.log("@message: " + data);
    })

    socket.on("update:feed", () => {
      console.log('update feed...')
      dispatch(getFeedAsync());
    });

    socket.on("update:thread", (threadId: string | number) => {
      console.log('update thread with id', threadId);
    });
  }

  useEffect(() => {
    catchAll();
    handleIO();
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
        <Route path="/app/logout" element={<Logout socket={socket} />} />
        <Route path="/app/requests" element={<ConnectRequests />} />
        <Route path="/app/thread/:thread_id" element={<Posts />} />
        <Route path="/" element={<Pages.Welcome ws={socket} />} />
      </Routes>
    </Container>
  </ErrorBoundary>)
}

export default App;
