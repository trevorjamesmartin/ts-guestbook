import React, {useEffect} from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Login } from './features/auth/Login';
import { Logout } from './features/auth/Logout';
import { UserList } from './features/users/UserList';
import { useAppSelector } from './memory/hooks';
import { selectors } from './features/auth/authSlice'
import './App.css';

const { selectLoggedIn } = selectors;

const navStyle={
  borderBottom: 'solid 1px',
  paddingBottom: '1rem',
}

function App() {
  const navigate = useNavigate();
  const loggedIn = useAppSelector(selectLoggedIn);
  useEffect(() => {
    // * catch-all (from api/server)
    const pathSearch = window.location.search.split('?')[1]||undefined;
    if (pathSearch && pathSearch.startsWith('/')) {
      navigate(pathSearch);
    }
  }, []);
  return (<>
  <div className='App'>
    <div className='App-Header'>
    <h1>App</h1>
    <div className="App-navigation">
      {loggedIn ? (
        <nav style={navStyle}>
          <Link className='App-link' to='/app'>Home</Link>
          <Link className='App-link' to='/app/users'>Users</Link>
          <Link className='App-link' to='/app/logout'>Logout</Link>
        </nav>
      ) :
        <nav style={navStyle}>
            <Link className='App-link' to="/login">Login</Link>
            <Link className='App-link' to="/register">Register</Link>
        </nav>
      }
    </div>
    
    <Routes>
      <Route path="/app" element={""} />
      <Route path="/app/users" element={<UserList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app/logout" element={<Logout />} />
      <Route path="/register" element="[registration form]" />
    </Routes>
    </div>
  </div>
  </>)
}

export default App;
