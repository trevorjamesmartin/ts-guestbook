import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Input, } from 'reactstrap';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

function SocketTest(props: any) {
  const socket: Socket<DefaultEventsMap, DefaultEventsMap> = props.socket;
  const defaultTo = 'message';
  const [state, setState] = useState({
    event: '',
    payload: '',
  });
  const [outState, setOutState] = useState([
    " - [test]",
  ]);
  const logThat = (msg:any) => {
    setState({
      event: '',
      payload: '',
    });
    setOutState([...outState, msg]);
  }
  const sendSocketEvent = (e:any) => {
    e.preventDefault();
    let event = state.event.trim();
    let payload = state.payload.trim();
    if (event === 'ping') {
      socket.send('PING');
      logThat('PING -> ...');
      return
    }
    if (event.length === 0) {
      event = defaultTo; // message
    }
    if (payload.length === 0) {
      console.log('what are you trying to send ?')
      return
    }

    logThat([event, payload].join(' -> '));
    socket.emit(event, payload);
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.currentTarget.name]: e.target.value });
  }

  return (
    <Container>
      <pre className='socket-event'>
        {outState.join('\n')}
      </pre>
      <Form onSubmit={sendSocketEvent}>
        <Input
          name="event"
          type="text"
          value={state.event}
          onChange={handleChange}
          placeholder="event name"
        />
        <Input
          name="payload"
          type="text"
          value={state.payload}
          onChange={handleChange}
          placeholder="payload data"
        />


        <Button className='btn-secondary'>send</Button>
      </Form>
    </Container>
  )
}

export default SocketTest
