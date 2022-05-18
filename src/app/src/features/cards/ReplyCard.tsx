import dayjs from 'dayjs';
import React from 'react';
import { Card, Container, Row, CardImg, CardText, CardBody, Col } from 'reactstrap';

const ReplyCard = (props: any) => {
  const profile = props.profile;
  const findAvatar = () => {
    if (props.author_id === profile.user_id) {
      return profile.avatar || "/user.png";
    }
    return props.avatar || "/user.png";
  }
  const posted_at = dayjs.utc(props.posted_at).local().fromNow()
  return (
    <Card key={props.id} className="blog-post">
      <Container>
        <Row xs="3" >
          <CardImg
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "/user.png";
            }}
            src={"/user.png"} className="shout-out-avatar" />
          <CardText className="shouter-username">@{props.username || "You"}</CardText>
          <CardText className="shouter-timestamp">{posted_at}</CardText>
        </Row>
        <Row xs="1">
          <CardText className="shouter-name">{props.name}</CardText>
        </Row>
        <CardBody>
          <CardText className="content">{props.content}</CardText>
        </CardBody>
        <Row xs="4">
          <Col />
          <Col />
          <Col />
        </Row>
      </Container>
    </Card>
  )
}

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