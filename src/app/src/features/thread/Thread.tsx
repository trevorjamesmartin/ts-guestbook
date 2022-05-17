import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { selectors as postsSelectors, getThreadAsync, replyPostAsync, actions as postsActions } from './postsSlice';
import { selectors as feedSelectors } from '../feed/feedSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { Spinner, Card, Container, Row, CardImg, CardText, CardBody, Form, Input, Button } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import PostCard from './Posts';

const { selectPosts, selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;
const { selectFeed } = feedSelectors;
const { selectProfile } = profileSelectors;


function Thread() {
  let { thread_id } = useParams();
  const dispatch = useAppDispatch();
  const replies = useAppSelector(selectPosts);
  const socialFeed = useAppSelector(selectFeed);
  const profile = useAppSelector(selectProfile);
  const currentPost = useAppSelector(selectCurrent);
  const mainThread = socialFeed.pages.find((value: any) => value.id === Number(thread_id));
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    lastLoaded: 0,
  });
  useEffect(() => {
    const delta = (Date.now() - state.lastLoaded);
    if (delta > 15000) {
      setState({ lastLoaded: Date.now() });
      dispatch(getThreadAsync(Number(thread_id)));
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [replies])

  function handleSubmitReply(e: any) {
    e.preventDefault();
    if (mainThread) {
      dispatch(replyPostAsync(mainThread.id));
      setTimeout(() => {
        dispatch(getThreadAsync(Number(thread_id)));
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
  const showReplies = (
    <ul>
      {replies?.sort((a: any, b: any) => a.id - b.id).map(pc => {
        return (
          <PostCard key={pc.id} {...pc} profile={profile} />
        )
      })}
    </ul>);

  const showLoading = (
    <Container className="centered-spinner-container">
      <Spinner />
    </Container>
  );

  const originalPost = (
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
      </Container>
    </Card>);

  return (<div className="Posts">
    {mainThread && originalPost}
    {
      loading ?
        showLoading :
        showReplies
    }
    <Form onSubmit={handleSubmitReply} >
      <div className="input-group mb-3">
        <Input className="reply-textarea" placeholder="..." type="textarea" value={currentPost?.content} onChange={handleChange} name="content" />
        <div className="input-group-append">
          <Button className="shout btn">reply</Button>

        </div>
      </div>
    </Form>
  </div>)
}
export default Thread;
