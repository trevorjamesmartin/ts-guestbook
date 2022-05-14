import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import relativeTime from 'dayjs/plugin/relativeTime';
import { BlogPost, selectors as postsSelectors, submitPostAsync, actions as postsActions } from '../posts/postsSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions } from './feedSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as authSelectors } from '../auth/authSlice'

import { selectors as userSelectors } from '../users/userSlice';

import {
  Form, FormGroup, Label, Input, Button,
  Card, CardBody, CardImg, CardText, Container, Row, Spinner, Col
} from 'reactstrap';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const { selectProfile } = profileSelectors;
const { selectFeed } = feedSelectors;
const { selectList } = userSelectors;
const { selectToken } = authSelectors;

const { clear: clearFeed } = feedActions;
const { selectCurrent } = postsSelectors;
const { setCurrent } = postsActions;

export const LiteralFood = (props: any) => {
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
    <Link className="clickable-card" to={`/app/thread/${props.id}`}>
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
          {replies.length > 0 && `replies: ${replies.length}` || 'reply'}
        </Container>
      </Card>
    </Link>
  )
}

function Feed() {
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);
  const socialFeed = useAppSelector(selectFeed);
  const token = useAppSelector(selectToken);
  const authorized = token && token.length > 4;
  const shoutOut: any = useRef();
  const dispatch = useAppDispatch();
  const currentPost: BlogPost = useAppSelector(selectCurrent);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (authorized) {
      dispatch(getFeedAsync());
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      dispatch(clearFeed());
      navigate('/login')
    }
  }, []);

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (socialFeed.status !== "pending") {
      dispatch(submitPostAsync());
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

  return (<div className="Posts">
    {authorized ?
      <>
        <Form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label for="shout-out">What's happening?</Label>
            <Input id="shout-out"
              ref={shoutOut}
              className="shout" placeholder="..."
              type="textarea"
              value={currentPost?.content}
              onChange={handleChange}
              name="content" />
            <Button className="shout-out btn-primary">shout</Button>
          </FormGroup>
        </Form>
        {
          loading ?
            <Container className="centered-spinner-container">
              <Spinner />
            </Container>
            :
            <>
              <ul>
                {socialFeed?.food?.filter((f: any) => !f.thread_id)
                  .map((mmm: any) => LiteralFood({
                    ...mmm,
                    profile,
                    replies: [
                      ...socialFeed?.food?.filter((reply: any) => reply.parent_id === mmm.id)
                    ]
                  })) || []}
              </ul>
            </>
        }
      </> :
      <><Label>ok then</Label></>
    }
  </div>)
}
export default Feed;
