import { ThunkDispatch } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { loginAsync, selectors, Credentials } from './authSlice';

const { selectLoggedIn, selectStatus, selectMessage } = selectors;

const initialState: Credentials = {
  username: "",
  password: ""
}

export function Login() {
  const loggedIn = useAppSelector(selectLoggedIn);
  const status = useAppSelector(selectStatus);
  const message:string = useAppSelector(selectMessage) || ""
  const dispatch:ThunkDispatch<any, Credentials, any> = useAppDispatch();
  const [state, setState] = useState<Credentials>(initialState);
  const handleChange = (e: { preventDefault: () => void; currentTarget: { name: string; }; target: { value: string; }; }) => {
    e.preventDefault();
    setState({...state, [e.currentTarget.name]: e.target.value });
  }
  const handleSubmitForm = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (state.password.length > 4 && state.username.length > 4) {
      dispatch(loginAsync(state));
      setState(initialState);
      // setTimeout(() => window.location.reload(), 500); // reload to trigger a websocket connection
    }
  }
  return (
    <div>
      {loggedIn ? (<>
      <p className="message-success">{message}</p>
      <Link className='App-link' to='/app'>continue</Link>
      </>)
      : <form onSubmit={handleSubmitForm}>
        <input name="username" value={state.username} onChange={handleChange}></input>
        <input type="password" name="password" value={state.password} onChange={handleChange}></input>
        <button>Submit</button>
      </form>
      }
    </div>
  )
}
