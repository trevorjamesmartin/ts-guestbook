import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';

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
import { Nav, NavItem, Navbar, NavbarBrand, NavbarToggler, Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

const { selectToken } = authSelectors;
const { selectProfile } = profileSelectors;
const { selectRequestsRecieved } = friendSelectors;
const { selectStatus: selectSocketStatus } = socketSelectors;

function Navigation(props: any) {
  const { socket, rtc } = props;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [clockConfig, setClockConfig] = useState({
    military: false,
    seconds: false,
  })
  const dispatch = useAppDispatch();
  // const authStatus: string = useAppSelector(selectAuthStatus);
  // const loggedIn: boolean = useAppSelector(selectLoggedIn);
  const socketStatus: string = useAppSelector(selectSocketStatus);
  // const message = useAppSelector(selectMessage);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const token = useAppSelector(selectToken);
  const profile = useAppSelector(selectProfile);
  // const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const authorized = token && token.length > 4;
  const [connection, setConnection] = useState<boolean>(socketStatus === 'connected');

  const refresh = useCallback(() => {
    dispatch(getProfileAsync({ socket }))
    dispatch(friendCheckAsync());
  }, [dispatch, socket]);

  useEffect(() => {
    if (authorized) {
      refresh();
    };
    let stateofconnect = socketStatus === 'connected';
    if (connection !== stateofconnect) {
      setConnection(!connection);
    }
  }, [token, socketStatus, rtc, refresh, authorized, connection]);

  function profileMenu() {
    return <UncontrolledDropdown
      inNavbar
    >
      <DropdownToggle nav>
        <i className="fa-solid fa-gear"></i>
      </DropdownToggle>
      <DropdownMenu>
        {authorized ? (
          <>
            <DropdownItem>
              <NavItem
                active={isActive('/app/profile')}
                className='nav-link'
                onClick={() => {
                  navigate(authorized ? '/app/profile' : '/login')
                }}
              >
                Profile
              </NavItem>
            </DropdownItem>
            <DropdownItem>
              <NavItem
                active={isActive('/app/settings')}
                className='nav-link'
                onClick={() => navigate(authorized ? '/app/settings' : '/login')}>
                Settings
              </NavItem>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavItem
                className="nav-link"
                onClick={() => navigate('/app/logout')}>
                Logout
              </NavItem>
            </DropdownItem>
          </>
        ) : (
          <>
            <DropdownItem>
              <NavItem
                className="nav-link"
                onClick={() => navigate('/about')}>
                About
              </NavItem>
            </DropdownItem>
          </>
        )
        }

      </DropdownMenu>
    </UncontrolledDropdown>
  }

  function connectionMenu() {
    return <UncontrolledDropdown
      inNavbar
    >
      <DropdownToggle nav>
        <i className="fa-solid fa-glasses"></i>
      </DropdownToggle>
      <DropdownMenu>
        {
          authorized && rtc ?
            <DropdownItem>
              <NavItem
                active={isActive('/app/test')}
                onClick={() => navigate('/app/test')}
              >{window.location.protocol}</NavItem>
              <NavItem
                active={isActive('/app/test')}
                onClick={() => navigate('/app/test')}
              >(test io)</NavItem>
            </ DropdownItem>
            : <DropdownItem>
              <NavItem>{window.location.protocol}</NavItem>
            </DropdownItem>
        }
        <DropdownItem>
          <span>{rtc ?
            <i className="fa-solid fa-check"></i> :
            ""} RTC</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  }

  function onlineNav() {
    return <Nav
      className="me-auto align-items-center"
      navbar
    >
      <NavItem
        className='nav-link'
        active={isActive('/app')}
        onClick={() => authorized ? navigate('/app') : navigate('/')}
      >
        App
      </NavItem>
      <NavItem
        className="nav-link"
        active={isActive('/app/users')}
        onClick={() => authorized ? navigate('/app/users') : navigate('/')}
      >
        Directory
      </NavItem>
      <NavItem
        className='nav-link'
        active={isActive('/about')}
        onClick={() => navigate('/about')}
      >
        About
      </NavItem>
      {friendRequests && friendRequests[0] && <NavItem
        className='nav-link'
        active={isActive('/app/requests')}
        onClick={() => navigate('/app/requests')}
      >{`Requests (${friendRequests.length}) `}</NavItem>}
    </Nav>
  }

  function offlineNav() {
    return <Nav
      className="me-auto align-items-center"
      navbar>
      <NavItem
        active={isActive('/login')}
        className='nav-link'
        onClick={() => navigate('/login')}
      >Login</NavItem>
      <NavItem
        active={isActive('/register')}
        className='nav-link'
        onClick={() => navigate('/register')}
      >Register</NavItem>
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
    <NavbarBrand className="nav-link" onClick={() => navigate('/')}>
      <img
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = "/user.png";
        }}
        src={profile.avatar || '/logo192.png'}
        width='32px'
        height='32px'
        alt={profile.name}
        className="navatar"
      />
    </NavbarBrand>
    <NavbarToggler onClick={toggleNavbar} />
    <Collapse navbar isOpen={!collapsed}>
      {authorized ? onlineNav() : offlineNav()}
      <Nav className="align-items-center">
        {authorized ? <NavItem active={isActive('/app/profile')}>
          {profileMenu()}
        </NavItem> : ""}
        {authorized ? <NavItem>
          {connectionMenu()}
        </NavItem> : ""}
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
