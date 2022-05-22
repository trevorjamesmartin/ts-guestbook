import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { selectors as postsSelectors, getThreadAsync, replyPostAsync, actions as postsActions } from './threadSlice';
import { selectors as feedSelectors } from '../feed/feedSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { Spinner, Card, Container, Row, CardImg, CardText, CardBody, Form, Input, Button } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import ReplyCard from "../cards/ReplyCard";
import dayjs from "dayjs";
const { selectListed, selectCurrent, selectStatus } = postsSelectors;
const { setCurrent } = postsActions;
const { selectFeed } = feedSelectors;
const { selectProfile } = profileSelectors;


function Thread(props:any) {
  let { thread_id } = useParams();
  const dispatch = useAppDispatch();
  const {socket} = props;
  const status = useAppSelector(selectStatus);
  const replies = useAppSelector(selectListed);
  const socialFeed = useAppSelector(selectFeed);
  const profile = useAppSelector(selectProfile);
  const currentPost = useAppSelector(selectCurrent);
  const mainThread = socialFeed.pages.find((value: any) => value.id === Number(thread_id));
  // const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    lastLoaded: 0,
  });
  useEffect(() => {
    const delta = (Date.now() - state.lastLoaded);
    if (delta > 15000) {
      setState({ lastLoaded: Date.now() });
      dispatch(getThreadAsync({ id: Number(thread_id), socket }));
      // setTimeout(() => {
      //   setLoading(false);
      // }, 500);
    }
  }, [replies.length])
  const posted_at = dayjs.utc(mainThread.posted_at).local().fromNow()

  function handleSubmitReply(e: any) {
    e.preventDefault();
    if (mainThread) {
      dispatch(replyPostAsync({ id: Number(thread_id) }));
      setTimeout(() => {
        dispatch(getThreadAsync({ id: Number(thread_id), socket }));
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
    {mainThread &&
      (
        <Card key={mainThread.id} className="blog-post">
          <Container>
            <Row xs="3" >
              <CardImg src={findAvatar()} className="shout-out-avatar" />
              <CardText className="shouter-username">@{mainThread.username || "You"}</CardText>
              <CardText className="shouter-timestamp">{posted_at}</CardText>
            </Row>
            <Row xs="1">
              <CardText className="shouter-name">{mainThread.name}</CardText>
            </Row>
            <CardBody>
              <CardText className="content">{mainThread.content}</CardText>
            </CardBody>
          </Container>
        </Card>)
    }
    {
      status === 'loading' ?
        // show spinner
        <Container className="centered-spinner-container">
          <Spinner />
        </Container>
        :
        // show replies
        <ul className="threadList">{[...replies.map(ReplyCard)]}</ul>
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
