import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, CardImg, CardText, CardBody, Col } from 'reactstrap';

const FeedCard = (props: any) => {
  const profile = props.profile;
  const replies = props.replies;
  const findAvatar = () => {
    if (props.avatar) {
      return props.avatar;
    }
    return profile.avatar || "/user.png";
  }
  const posted_at = dayjs.utc(props.posted_at).local().fromNow()
  return (
    <Link key={props.id} className="clickable-card" to={`/app/thread/${props.id}`}>
      <Card key={props.id} className="blog-post">
        <Container>
          <Row xs="3" >
            <CardImg
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "/user.png";
              }}
              src={findAvatar()} className="shout-out-avatar" />
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
          {replies.length > 0 ? `replies: ${replies.length}` : 'reply'}
        </Container>
      </Card>
    </Link>
  )
}
export default FeedCard;
