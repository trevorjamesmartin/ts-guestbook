// import dayjs from 'dayjs';
import React from 'react';
import { Container, CardImg } from 'reactstrap';

function ThreadReply(props: any) {
  const profile = props.profile;
  const findUsername = () => {
    if (props.author_id === profile.user_id) {
      return `${profile.username} (you)`
    }
    return props.username
  }
  const findAvatar = () => {
    if (props.avatar) {
      return props.avatar;
    }
    if (props.author_id === profile.user_id) {
      return profile.avatar || "/user.png";
    }
    return "/user.png";
  }
  return <Container className='d-flex flex-row'>
    <div>
      <CardImg
        alt={findUsername()}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = "/user.png";
        }}
        src={findAvatar()} className="reply-avatar"
      />
    </div>
    <div>
      <pre>{props.content}</pre>
    </div>
  </Container>
}
export default ThreadReply
