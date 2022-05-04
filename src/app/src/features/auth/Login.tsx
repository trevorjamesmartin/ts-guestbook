import { ThunkDispatch } from "@reduxjs/toolkit";
// import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
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
  const message: string = useAppSelector(selectMessage) || ""
  const dispatch: ThunkDispatch<any, Credentials, any> = useAppDispatch();
  const [state, setState] = useState<Credentials>(initialState);
  const handleChange = (e: { preventDefault: () => void; currentTarget: { name: string; }; target: { value: string; }; }) => {
    e.preventDefault();
    setState({ ...state, [e.currentTarget.name]: e.target.value });
  }
  const handleSubmitForm = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (state.password.length > 4 && state.username.length > 4) {
      dispatch(loginAsync(state));
      setState(initialState);
      setTimeout(() => window.location.reload(), 1700); // reload to trigger a websocket connection
    }
  }
  return (
    <div>
      <h2>Login</h2>
      {loggedIn ? (<>
        <h4 className="message-success">{message}</h4>
      </>)
        : <Form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input name="username" placeholder="alienmask" value={state.username} onChange={handleChange}></Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" placeholder="***************" name="password" value={state.password} onChange={handleChange}></Input>
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      }
    </div>
  )
}
