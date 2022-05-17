import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, CardImg, CardText, CardBody, Col } from 'reactstrap';

const ReplyCard = (props: any) => {
  const profile = props.profile;
  const findAvatar = () => {
    if (props.avatar) {
      return props.avatar;
    }
    return profile.avatar || "/user.png";
  }
  const posted_at = dayjs.utc(props.posted_at).local().fromNow()
  return (
    // <Link key={props.id} className="clickable-card" to={`/app/thread/${props.id}`}>
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
    // </Link>
  )
}

const ThreadReply = (props: any) => {
  return <h2>{props.content}</h2>
}
export default ReplyCard