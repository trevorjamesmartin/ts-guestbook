// import dayjs from 'dayjs';
import React from 'react';
import { Container, CardImg } from 'reactstrap';

function ThreadReply(props: any) {
  return <Container className='d-flex flex-row'>
    <div>
      <CardImg
        alt={props.username}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = "/user.png";
        }}
        src={props?.avatar ? props.avatar : '/user.png'} className="reply-avatar"
      />
    </div>
    <div>
      <pre>{props.content}</pre>
    </div>
  </Container>
}
export default ThreadReply
