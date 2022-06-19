import React, { useEffect, useState, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { io, Socket } from "socket.io-client";
import { AppEventsMap } from './features/network/config';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import {
  // components
  About, ConnectRequests, Login, Logout, Navigation, PublicProfile,
  Pages, Profile, SocketTest, Register, Thread, UserView, /*UserList, UserCarousel,*/
  // selectors
  authSelectors, profileSelectors, // socketSelectors, 
  // io handler
  handleIO
} from './features';

// style
import './App.css';

const { selectToken } = authSelectors;
const { selectProfile } = profileSelectors;
// const { selectStatus: selectSocketStatus } = socketSelectors;

function App() {
  const [localSocket, setSocket] = useState<Socket<AppEventsMap, AppEventsMap> | undefined>(undefined);
  // Real Time Connection?, (toggle)
  const [rtc,] = useState(true); // start connected.
  const connectIt = rtc && localSocket;
  // Router
  const navigate = useNavigate();
  // Redux
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const token = useAppSelector(selectToken);
  // const ioStatus = useAppSelector(selectSocketStatus);
  const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;
  
  const resetIO = useCallback(() => {
    localSocket?.disconnect();
    let socket:Socket = io(baseURL, {
      withCredentials: true,
      auth: { token }
    });
    handleIO(socket, dispatch, profile, token, navigate);
    setSocket(socket); // save localSocket
  }, [localSocket, setSocket, baseURL, dispatch, navigate, profile, token]);

  useEffect(() => {
    if (token && !localSocket) {
      resetIO();
      return
    }
    if (rtc) {
      localSocket?.connect();
    } else {
      localSocket?.disconnect();
    }
  }, [rtc, token, resetIO, localSocket]);

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
        <Route path="/app/users" element={<UserView socket={localSocket} />} />
        <Route path="/app/users/:username" element={<PublicProfile socket={localSocket} />} />
        <Route path="/app/profile" element={<Profile socket={localSocket} />} />
        <Route path="/app/settings" element={<Pages.SettingsPage />} />
        <Route path="/app/logout" element={<Logout socket={localSocket} />} />
        <Route path="/app/requests" element={<ConnectRequests socket={localSocket} />} />
        <Route path="/app/thread/:thread_id" element={<Thread socket={localSocket} />} />
        <Route path="/" element={<Pages.Welcome ws={localSocket} />} />
      </Routes>
    </Container>
  </ErrorBoundary>)
}

export default App;
