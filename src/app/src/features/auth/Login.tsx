import { ThunkDispatch } from "@reduxjs/toolkit";
import React, { useState, useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { loginAsync, selectors, Credentials } from './authSlice';

const { selectLoggedIn, selectStatus, selectMessage } = selectors;

const initialState: Credentials = {
  username: "",
  password: ""
}

export function Login() {
  const navigate = useNavigate();
  const loggedIn = useAppSelector(selectLoggedIn);
  const status = useAppSelector(selectStatus);
  const message: string = useAppSelector(selectMessage) || ""
  const dispatch: ThunkDispatch<any, Credentials, any> = useAppDispatch();
  const [state, setState] = useState<Credentials>(initialState);
  //@ts-ignore
  useEffect(() => {
    // cookies.remove('monkey');
    // let c = document.cookie.match(/monkey/);
    // console.log(c);
  })
  const handleSubmitForm = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (state.password.length > 4 && state.username.length > 0) {
      dispatch(loginAsync(state));
      setState(initialState);
      setTimeout(() => {
        navigate('/')
        // Re-initiate the websocket connection; Now, authorized.
        // window.location.replace('/'); // is there a better to handle this ?
      }, 1700);
    }
  }
  return (
    <div>
      <h2>Login</h2>
      {loggedIn ? (<>
        <h4 className="message-success">{message}</h4>
        <div className="spinner-wrap">
            {<Spinner center />}
        </div>
      </>)
        : <Form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input name="username" autoComplete="name" value={state.username} onChange={(e) => {
              e.preventDefault();
              setState({ ...state, username: e.target.value });
            }}></Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input name="password" type="password" autoComplete="current-password" value={state.password} onChange={(e) => {
              e.preventDefault();
              setState({ ...state, password: e.target.value })
            }}></Input>
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      }
    </div>
  )
}
