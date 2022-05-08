import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { selectors as authSelectors } from '../auth/authSlice'
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as friendSelectors, friendCheckAsync } from '../social/friendSlice';
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import { getProfileAsync } from '../profile/profileSlice';
import { Nav, NavLink, NavItem, Navbar, NavbarBrand, NavbarToggler, Collapse, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
const { selectToken } = authSelectors;
const { selectProfile } = profileSelectors;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;

function Navigation() {
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState(true);
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

  return (
      <Navbar
        color="light"
        expand="md"
        light
      >
        <NavbarBrand href="/">🧭</NavbarBrand>
        <Link  className='nav-link' to={authorized ? '/app' : '/'}>
          App
        </Link>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse navbar isOpen={!collapsed}>
          {authorized ? (
            <Nav
              className="me-auto"
              navbar
            >
              <NavItem active={window.location.pathname === '/app/users'}>
                <Link className='nav-link' to='/app/users'>People</Link>
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
                <DropdownMenu end>
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
              <NavItem>
                <Link className='nav-link' to='/app/requests'>{friendRequests.length > 0 && `(${friendRequests.length}) `}Request</Link>
              </NavItem>
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
              src={profile.avatar || '/user.png'}
              width='42px'
              alt={profile.name}
            />
          </Link>
        </Collapse>

      </Navbar>
  )
}

export default Navigation;
