import React, { useState } from 'react';
import { selectors as webSocketSelectors, actions as webSocketActions } from '../network/socketSlice'
import { useParams } from 'react-router-dom'
import { Container, Form, Input, Button } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
const { echoPrivate } = webSocketActions;
const { selectPrivate } = webSocketSelectors;
function Messenger(props: any) {
  const dispatch = useAppDispatch();
  const socket = props.socket;
  const params = useParams();
  const [chat, setChat] = useState<string>("");
  const toUsername = params.username;
  const privateChats = useAppSelector(selectPrivate);
  const thisChat = toUsername ? privateChats[toUsername] : ['empty']

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (chat.length > 0) {
      socket.emit("private:message", toUsername, chat);
      dispatch(echoPrivate([toUsername, chat]));
      setChat("");
    }
  }
  const handleChange = (e: any) => {
    e.preventDefault();
    setChat(e.target.value);
  }

  return <div className='messenger-wrapper'>
    <pre className='messenger'>
      {thisChat?.join('\n')}
    </pre>
    <Form onSubmit={sendMessage}>
      <Input
        className='messenger-input'
        type="text"
        onChange={handleChange}
        value={chat}
        placeholder="say something"
      />
      <Button type="submit">send</Button>
    </Form>
  </div>
}

export default Messenger;
