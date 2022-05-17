import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// local memory
import { selectors as authSelectors } from '../auth/authSlice'
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as friendSelectors, friendCheckAsync } from '../social/friendSlice';
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import { getProfileAsync } from '../profile/profileSlice';
import { selectors as socketSelectors } from '../network/socketSlice';
// local component
import Clock from './Clock';
// bootstrap components
import { Nav, NavLink, NavItem, Navbar, NavbarBrand, NavbarToggler, Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

const { selectToken, selectStatus: selectAuthStatus, selectLoggedIn } = authSelectors;
const { selectProfile } = profileSelectors;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;
const { selectStatus: selectSocketStatus, selectMessage } = socketSelectors;

function Navigation() {
  const [collapsed, setCollapsed] = useState(true);
  const [clockConfig, setClockConfig] = useState({
    military: false,
    seconds: false,
  })
  const dispatch = useAppDispatch();
  const authStatus: string = useAppSelector(selectAuthStatus);
  const loggedIn: boolean = useAppSelector(selectLoggedIn);
  const socketStatus: string = useAppSelector(selectSocketStatus);
  const message = useAppSelector(selectMessage);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const token = useAppSelector(selectToken);
  const profile = useAppSelector(selectProfile);
  const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const authorized = token && token.length > 4;

  useEffect(() => {
    if (authorized) {
      dispatch(getProfileAsync())
      dispatch(friendCheckAsync());
    };
  }, [token]);

  const networkStatus = () => {
    if (loggedIn) {
      switch (socketStatus) {
        case 'connected':
          return "🟢"

        case 'disconnected':
          return "🔴";

        default:
          break;
      }
    }
  }

  function profileMenu() {
    return <UncontrolledDropdown
      inNavbar
    >
      <DropdownToggle nav>
        <img
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/user.png";
          }}
          className="navatar"
          src={profile.avatar || '/user.png'}
          width='32px'
          height='32px'
          alt={profile.name}
        />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
            <Link className='nav-link' to={authorized ? '/app/profile' : '/login'}>
          <NavItem active={isActive('/app/profile')}>
              Profile
          </NavItem>
            </Link>
        </DropdownItem>
        <DropdownItem disabled>
          <Link className='nav-link' to="#">
            Settings
          </Link>
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem>
          <NavItem>
            <Link className='nav-link' to='/app/logout'>
              Logout
            </Link>
          </NavItem>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  }

  function onlineNav() {
    return <Nav
      className="me-auto align-items-center"
      navbar
    >
      <Link className='nav-link' to={authorized ? '/app' : '/'}>
        <NavItem active={isActive('/app')}>
          App
        </NavItem>
      </Link>
      <Link className='nav-link' to='/app/users'>
        <NavItem active={isActive('/app/users')}>
          Directory
        </NavItem>
      </Link>
      <Link className='nav-link' to='/about'>
        <NavItem active={isActive('/about')}>
          About
        </NavItem>
      </Link>
      {friendRequests[0] &&<Link className='nav-link' to='/app/requests'>
        <NavItem active={isActive('/app/requests')}>
          {`Requests (${friendRequests.length}) `}
        </NavItem>
      </Link>}
    </Nav>
  }

  function offlineNav() {
    return <Nav
      className="me-auto align-items-center"
      navbar>
      <NavItem active={isActive('/login')}>
        <Link className='nav-link' to="/login">
          Login
        </Link>
      </NavItem>
      <NavItem active={isActive('/register')}>
        <Link className='nav-link' to="/register">
          Register
        </Link>
      </NavItem>
    </Nav >
  }

  function isActive(path: string) {
    return window.location.pathname === path
  }

  return <Navbar
    color="light"
    expand="md"
    light
  >
    <NavbarBrand>🧭</NavbarBrand>
    <NavbarToggler onClick={toggleNavbar} />
    <Collapse navbar isOpen={!collapsed}>
      {authorized ? onlineNav() : offlineNav()}
      <Nav className="align-items-center">
        {loggedIn &&
          <NavItem active={isActive('/app/profile')}>
            {profileMenu()}
          </NavItem>}
        <span className="socket-connect-status">{networkStatus()}</span>

        <UncontrolledDropdown
          inNavbar
        >
          <DropdownToggle nav>
            <Clock key={clockConfig.military ? "24 hour" : "12 hour" + clockConfig.seconds ? " + seconds" : ""} clockConfig={clockConfig} />
          </DropdownToggle>
          <DropdownMenu>
            <NavItem onClick={() => {
              setClockConfig({ ...clockConfig, military: !clockConfig.military })
            }}>
              <DropdownItem>
                {clockConfig.military ? "12 hour" : "24 hour"}
              </DropdownItem>
            </NavItem>
          </DropdownMenu>
        </UncontrolledDropdown>


      </Nav>
    </Collapse >
  </Navbar >

}

export default Navigation;
