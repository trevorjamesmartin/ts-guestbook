import React, { useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { io, Socket } from "socket.io-client";
import { AppEventsMap } from './features/network/config';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import {
  // components
  About, ConnectRequests, Login, Logout, Navigation, 
  Pages, Profile, SocketTest, Register,Thread, UserList,
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
      <Navigation toggleRTC={() => toggleRTC(!rtc)} socket={connectIt} />
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
        <Route path="/app/profile" element={<Profile socket={connectIt} />} />
        <Route path="/app/logout" element={<Logout socket={connectIt} />} />
        <Route path="/app/requests" element={<ConnectRequests />} />
        <Route path="/app/thread/:thread_id" element={<Thread socket={connectIt} />} />
        <Route path="/" element={<Pages.Welcome ws={connectIt} />} />
      </Routes>
    </Container>
  </ErrorBoundary>)
}

export default App;
