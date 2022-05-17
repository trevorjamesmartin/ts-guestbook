import React from 'react';
import { Card, Container, CardBody, CardImg, CardText, Col, Row } from 'reactstrap';


const PostCard = (props: any) => {
    const profile = props.profile
    const findAvatar = () => {
        if (profile.user_id === props.author_id) {
            return profile?.avatar || "/user.png";
        }
        return props.avatar || "/user.png";
    }
    return (
        <Card key={props.key} className="blog-post">
            <Container>
                <Row xs="3" >
                    <CardImg src={findAvatar()} className="shout-out-avatar"
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = "/user.png";
                        }}
                    />
                    <CardText className="shouter-username">@{props.username || "You"}</CardText>
                    {/* <CardText className="shouter-timestamp">{posted_at}</CardText> */}
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
                    {/* <Link to={`/app/thread/${mainThread.id}`}>{replies.length > 0 && `replies: ${replies.length}` || 'reply'}</Link> */}
                </Row>
            </Container>
        </Card>
    )
}

export default PostCard;

