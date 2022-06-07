import React, { useEffect, useState, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { io, Socket } from "socket.io-client";
import { AppEventsMap } from './features/network/config';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import {
  // components
  About, ConnectRequests, Login, Logout, Navigation,
  Pages, Profile, SocketTest, Register, Thread, UserView, /*UserList, UserCarousel,*/
  Messenger,
  // selectors
  authSelectors, socketSelectors, profileSelectors,
  // io handler
  handleIO
} from './features';

// style
import './App.css';

const { selectToken } = authSelectors;
const { selectProfile } = profileSelectors;
const { selectStatus: selectSocketStatus } = socketSelectors;

function App() {
  const [localSocket, setSocket] = useState<Socket<AppEventsMap, AppEventsMap> | undefined>(undefined);
  // Real Time Connection?, (toggle)
  const [rtc, setRTC] = useState(true); // start connected.
  const connectIt = rtc && localSocket;
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const token = useAppSelector(selectToken);
  const ioStatus = useAppSelector(selectSocketStatus);
  const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;
  
  const resetIO = useCallback(() => {
    localSocket?.disconnect();
    let socket:Socket = io(baseURL, {
      withCredentials: true,
      auth: { token }
    });
    handleIO(socket, dispatch, profile, token, navigate);
    setSocket(socket); // save localSocket
  }, [localSocket, setSocket]);

  useEffect(() => {
    if (token && !localSocket) {
      // console.log('[io] create initial connection');
      resetIO();
      return
    }
  }, [token, resetIO]);

  useEffect(() => {
    if (rtc) {
      // console.log('(connect)')
      localSocket?.connect();
    } else {
      // console.log('(disconnect)')
      localSocket?.disconnect();
    }
  }, [rtc])

  return (<ErrorBoundary>
    <div className='App'>
      <Navigation toggleRTC={() => {}} rtc={rtc} socket={connectIt} />
    </div>
    <Container>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login getSocket={() => localSocket} />} />
        <Route path="/app/test" element={<SocketTest socket={localSocket} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<Pages.MainPage ws={localSocket} />} />
        <Route path="/app/messenger/:username" element={<Messenger socket={localSocket} />} />
        <Route path="/app/users" element={<UserView socket={localSocket} />} />
        <Route path="/app/profile" element={<Profile socket={localSocket} />} />
        <Route path="/app/logout" element={<Logout socket={localSocket} />} />
        <Route path="/app/requests" element={<ConnectRequests socket={localSocket} />} />
        <Route path="/app/thread/:thread_id" element={<Thread socket={localSocket} />} />
        <Route path="/" element={<Pages.Welcome ws={localSocket} />} />
      </Routes>
    </Container>
  </ErrorBoundary>)
}

export default App;
