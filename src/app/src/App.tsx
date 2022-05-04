import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { Register } from './features/auth/Register';
import MainPage from './features/pages/Main';
import { UserList } from './features/users/UserList';
import Profile from './features/profile/Profile';
import { useAppSelector, useAppDispatch } from './memory/hooks';
import { selectors as authSelectors } from './features/auth/authSlice'
import { selectors as webSocketSelectors, actions as webSocketActions } from './features/pages/wsSlice';
import { selectors as profileSelectors } from './features/profile/profileSlice';
import { Container, Nav, NavLink, NavItem, Navbar, NavbarBrand, NavbarToggler, Collapse, NavbarText, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import './App.css';

const { selectProfile } = profileSelectors;
const { selectToken } = authSelectors;
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
  const token = useAppSelector(selectToken);
  const profile = useAppSelector(selectProfile);
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
    // let host = window.location.host;
    console.log('-> ws')
    let local_url: string = window.location.protocol + "://" + window.location.host
    let base_url: string = process.env.REACT_APP_BASE_URL || local_url;
    let ws_url: string = `ws://${base_url.split('://')[1]}/`;
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
      if (window.location.pathname === '/logout') navigate('/login');
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

  const authorized = token && token.length > 4;

  return (<>
    <div className='App'>
      <div className="App-navigation">
        <Navbar
          color="light"
          expand="md"
          light
        >
          <NavbarBrand>
            <Link className='nav-link' to={authorized ? '/app' : '/'}>App</Link>
          </NavbarBrand>
          <NavbarToggler onClick={function noRefCheck() {
            
          }} />
          <Collapse navbar>
            {authorized ? (
              <Nav
                className="me-auto"
                navbar
              >
                <NavItem active={window.location.pathname === '/app/users'}>
                  <Link className='nav-link' to='/app/users'>Users</Link>
                </NavItem>
                <NavItem>
                  <NavLink target="_blank" href="https://github.com/trevorjamesmartin/vigilant-cloud">
                    GitHub
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown
                  inNavbar
                  nav
                >
                  <DropdownToggle
                    caret
                    nav
                  >
                    Options
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      Option 1
                    </DropdownItem>
                    <DropdownItem>
                      Option 2
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <NavItem active={window.location.pathname === '/app/logout'}>
                        <Link className='nav-link' to='/app/logout'>Logout</Link>
                      </NavItem>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            ) : (
              <Nav
                className="me-auto"
                navbar>
                <NavItem>
                  <Link className='nav-link' to="/login">
                    Login
                  </Link>
                </NavItem>
                <NavItem>
                  <Link className='nav-link' to="/register">
                    Register
                  </Link>
                </NavItem>
              </Nav>
            )}
            <Link to={authorized ? '/app/profile' : '/login'}>
              <img
                src={profile.avatar ? profile.avatar : '/user.png'}
                width='42px'
                alt={profile.name}
              />
            </Link>
          </Collapse>
          
        </Navbar>
      </div>
    </div>
      <Container>
        <Routes>
          <Route path="/app" element={<MainPage ws={ws} />} />
          <Route path="/app/users" element={<UserList />} />
          <Route path="/app/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Container>
      
      {/* <span id="ws-message">{wsStatus} [{message}]</span> */}

  </>)
}

export default App;
