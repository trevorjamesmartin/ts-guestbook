import { ThunkDispatch } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { registerAsync, selectors, Credentials } from './authSlice';

const { selectLoggedIn, selectStatus, selectMessage } = selectors;

const initialState: any = {
  username: "",
  password: "",
}

export function Register() {
  const navigate = useNavigate();
  const loggedIn = useAppSelector(selectLoggedIn);
  const status = useAppSelector(selectStatus);
  const message:string = useAppSelector(selectMessage) || ""
  const dispatch:ThunkDispatch<any, Credentials, any> = useAppDispatch();
  const [state, setState] = useState<any>({...initialState, password1: ''});
  const handleChange = (e: { preventDefault: () => void; currentTarget: { name: string; }; target: { value: string; }; }) => {
    e.preventDefault();
    setState({...state, [e.currentTarget.name]: e.target.value });
  }
  const handleSubmitForm = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (state.password !== state.password1) {
      console.log('passwords dont match!');
      return
    }
    if (state.password.length > 4 && state.username.length > 4) {
      dispatch(registerAsync({ username: state.username, password: state.password }));
      setState(initialState);
      setTimeout(() => navigate('/login'), 1700); // reload to trigger a websocket connection
    }
  }
  return (
    <div>
      <h2>Register</h2>
      {loggedIn ? (<>
      <h4 className="message-success">{message}</h4>
      </>)
      : <form onSubmit={handleSubmitForm}>
        <input name="username" value={state.username} onChange={handleChange}></input>
        <input type="password" name="password" value={state.password} onChange={handleChange}></input>
        <input type="password" name="password1" value={state.password1} onChange={handleChange}></input>
        <button>Submit</button>
      </form>
      }
    </div>
  )
}
