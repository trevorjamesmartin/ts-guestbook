import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { selectors as authSelectors } from '../auth/authSlice'
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as friendSelectors, friendCheckAsync } from '../social/friendSlice';
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import { getProfileAsync } from '../profile/profileSlice';
import { selectors as socketSelectors } from '../network/socketSlice';
import { Nav, NavLink, NavItem, Navbar, NavbarBrand, NavbarToggler, Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

const { selectToken, selectStatus: selectAuthStatus, selectLoggedIn } = authSelectors;
const { selectProfile } = profileSelectors;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;
const { selectStatus: selectSocketStatus, selectMessage } = socketSelectors;

class Clock extends React.Component<any> {
  state: any;
  interval: any;
  format: string;
  config:any;
  constructor(props: any) {
    const { clockConfig, ...duper } = props;
    super(duper);
    this.format = clockConfig?.seconds ? 'LTS' : 'LT';
    if (clockConfig?.military) {
      this.format = 'HH:mm:ss';
    }
    this.config = clockConfig;
    this.state = {
      time: dayjs(new Date()).format(this.format)
    };
  };

  componentDidMount() {
    this.format = this.config?.seconds ? 'LTS' : 'LT';
    if (this.config?.military) {
      this.format = 'HH:mm:ss';
    }
    this.interval = setInterval(() => this.setState({
      time: dayjs(new Date()).format(this.format)
    }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <span className="app-clock">{this.state.time}</span>
    );
  }
}


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
      <DropdownMenu end>
        <DropdownItem>
          <NavItem active={isActive('/app/profile')}>
            <Link to={authorized ? '/app/profile' : '/login'}>
              Profile
            </Link>
          </NavItem>
        </DropdownItem>
        <DropdownItem>
          Settings
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
      <NavItem active={isActive('/app')}>
        <Link className='nav-link' to={authorized ? '/app' : '/'}>
          App
        </Link>
      </NavItem>
      <NavItem active={isActive('/app/users')}>
        <Link className='nav-link' to='/app/users'>People</Link>
      </NavItem>
      <NavItem>
        <NavLink target="_blank" href="https://github.com/trevorjamesmartin/vigilant-cloud">
          GitHub
        </NavLink>
      </NavItem>
      <NavItem active={isActive('/app/requests')}>
        <Link className='nav-link' to='/app/requests'>{friendRequests.length > 0 && `(${friendRequests.length}) `}Request</Link>
      </NavItem>
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
            <Clock key={clockConfig.military ? "24 hour": "12 hour"+ clockConfig.seconds ? " + seconds": "" } clockConfig={clockConfig} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>
              <NavItem onClick={() => {
                setClockConfig({ ...clockConfig, military: !clockConfig.military })
              }}>
                {clockConfig.military ? "12 hour" : "24 hour"}
              </NavItem>
            </DropdownItem>
            {/* <DropdownItem>
              <NavItem onClick={() => {
                setClockConfig({ ...clockConfig, seconds: !clockConfig.seconds })
              }}>
                {!clockConfig.military ? "Seconds" : ""}
              </NavItem>
            </DropdownItem>
            <DropdownItem divider /> */}
          </DropdownMenu>
        </UncontrolledDropdown>


      </Nav>
    </Collapse >
  </Navbar >

}

export default Navigation;
