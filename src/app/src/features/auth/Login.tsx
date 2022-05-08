import { ThunkDispatch } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
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
    console.log(state)
    if (state.password.length > 4 && state.username.length > 0) {
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
        <div className="spinner-wrap">
            {<Spinner center />}
        </div>
      </>)
        : <Form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input name="username" value={state.username} onChange={handleChange}></Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" value={state.password} onChange={handleChange}></Input>
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      }
    </div>
  )
}
