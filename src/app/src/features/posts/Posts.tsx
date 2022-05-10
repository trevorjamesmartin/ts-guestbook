import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";

import { BlogPost, selectors as postsSelectors, getPostsAsync, replyPostAsync, actions as postsActions } from './postsSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions } from '../feed/feedSlice';
import { LiteralFood } from '../feed/Feed'
import { selectors as profileSelectors } from '../profile/profileSlice';
import { Form, FormGroup, Label, Input, Button, Card, Container, CardBody, CardImg, CardText, Col, Row } from 'reactstrap';
const { selectPosts, selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;
const { selectFeed } = feedSelectors;
const { selectProfile } = profileSelectors;

const PostCard = (props: any) => {
    const profile = props.profile
    // console.log({ props })
    // console.log({profile})
    // const replies = props.replies;
    const findAvatar = () => {
        if (profile.user_id === props.author_id) {
            return profile?.avatar || "/user.png";
        }
        return props.avatar || "/user.png";
    }
    return (
        <Card key={props.id} className="blog-post">
            <Container>
                <Row xs="3" >
                    <CardImg src={findAvatar()} className="shout-out-avatar" />
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

function Thread() {
    let { thread_id } = useParams();
    const dispatch = useAppDispatch();
    const currentList = useAppSelector(selectPosts);
    const socialFeed = useAppSelector(selectFeed);
    const profile = useAppSelector(selectProfile);
    const currentPost = useAppSelector(selectCurrent);
    const mainThread = socialFeed.food.find((value: any) => value.id === Number(thread_id));
    const replies = socialFeed.food.filter((value: any) => value.thread_id === Number(thread_id));

    useEffect(() => {
        if (thread_id) {
            console.log('thread id ', thread_id)
            console.log({ mainThread })
            console.log(currentList)
            console.log(socialFeed)
        }
        // dispatch(getPostsAsync());
    }, [])
    const handleSubmitReply = (e: any) => {
        e.preventDefault();
        if (mainThread) {
            dispatch(replyPostAsync(mainThread.id));
            setTimeout(() => {
                dispatch(getFeedAsync());
            }, 500);
        }
    }
    const handleChange = (e: any) => {
        let name: string = e.currentTarget.name;
        let value: any = e.target.value;
        dispatch(setCurrent({ [name]: value }));
    }
    const findAvatar = () => {
        if (mainThread) {
            return profile.user_id === mainThread.author_id ?
                profile.avatar || "/user.png" :
                mainThread.avatar || "/user.png";
        }
        return "/user.png";
    }

    return (<div className="Posts">
        {mainThread && (
            <Card key={mainThread.id} className="blog-post">
                <Container>
                    <Row xs="3" >
                        <CardImg src={findAvatar()} className="shout-out-avatar" />
                        <CardText className="shouter-username">@{mainThread.username || "You"}</CardText>
                        {/* <CardText className="shouter-timestamp">{posted_at}</CardText> */}
                    </Row>
                    <Row xs="1">
                        <CardText className="shouter-name">{mainThread.name}</CardText>
                    </Row>
                    <CardBody>
                        <CardText className="content">{mainThread.content}</CardText>
                    </CardBody>
                    <Row xs="4">
                        <Col />
                        <Col />
                        <Col />
                        {/* <Link to={`/app/thread/${mainThread.id}`}>{replies.length > 0 && `replies: ${replies.length}` || 'reply'}</Link> */}
                    </Row>
                </Container>
            </Card>)}
        <ul>
            {replies?.sort((a: any, b: any) => a.id - b.id).map(pc => <PostCard {...pc} profile={profile} />)}
        </ul>
        <Form onSubmit={handleSubmitReply} >
            <Input className="reply-textarea" placeholder="..." type="textarea" value={currentPost?.content} onChange={handleChange} name="content" />
            <Button color="primary">reply</Button>
        </Form>
    </div>)
}
export default Thread;


