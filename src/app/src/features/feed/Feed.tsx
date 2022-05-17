import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import relativeTime from 'dayjs/plugin/relativeTime';
import { BlogPost, selectors as postsSelectors, submitPostAsync, actions as postsActions } from '../thread/postsSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions } from './feedSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as authSelectors } from '../auth/authSlice'

import {
  Form, FormGroup, Label, Input, Button,
  Card, CardBody, CardImg, CardText, Container, Row, Spinner, Col
} from 'reactstrap';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const { selectProfile } = profileSelectors;
const { selectFeed } = feedSelectors;
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
          {replies.length > 0 && `replies: ${replies.length}` || 'reply'}
        </Container>
      </Card>
    </Link>
  )
}

function Feed() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);
  const socialFeed:any = useAppSelector(selectFeed);
  const token = useAppSelector(selectToken);
  const authorized = token && token.length > 4;
  const shoutOut: any = useRef();
  const dispatch = useAppDispatch();
  const currentPost: BlogPost = useAppSelector(selectCurrent);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ lastLoaded: 0, page: searchParams.get('page') });

  useEffect(() => {
    const delta = (Date.now() - state.lastLoaded);
    if (!authorized) {
      dispatch(clearFeed());
      navigate('/login')
      return
    }
    if (delta > 15000) {
      setState({ lastLoaded: Date.now(), page: searchParams.get('page') });
      dispatch(getFeedAsync({ page: searchParams.get('page'), limit: searchParams.get('limit') }));
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [socialFeed.pages, searchParams]);

  const page = !socialFeed.previous ? 1 : socialFeed.previous.page + 1;

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (socialFeed.status !== "pending") {
      dispatch(submitPostAsync());
      setTimeout(() => {
        dispatch(getFeedAsync({ page: searchParams.get('page') }));
      }, 500);
    }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    let name: string = e.currentTarget.name;
    let value = e.target.value;
    dispatch(setCurrent({ [name]: value }));
  }

  const turnPage = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    switch (e.currentTarget.name) {
      case "previous":
        console.log('< previous page')
        searchParams.set('page', socialFeed.previous.page);
        break;
      case "next":
        console.log('next page >')
        searchParams.set('page', socialFeed.next.page);
        break;
      default:
        break;
    }
    setState({ lastLoaded: Date.now(), page: searchParams.get('page') });
    dispatch(getFeedAsync({ page: searchParams.get('page') }));
  }

  function Paginator() {
    return <Container className="paginator flex align-items-center text-center" hidden={!(socialFeed.next || socialFeed.previous)} >
      {!socialFeed?.previous?.page || page === 1 ?
        <Button className="paginator btn" disabled>⇦</Button> :
        <Button name="previous" className="paginator btn btn-success"
          onClick={turnPage}
        >⇦</Button>}
      <Label>{page}</Label>
      {!socialFeed?.next?.page ?
        <Button className="paginator btn" disabled>⇨</Button> :
        <Button name="next" className="paginator btn btn-success"
          onClick={turnPage}
        >⇨</Button>}
    </Container>
  }

  return (<div className="Posts">
    {authorized ?
      <>
        <Form onSubmit={handleSubmitForm}>
          <FormGroup>
            <Label for="shout-out">What's happening?</Label>
            <div className="input-group mb-3">
              <Input id="shout-out"
                ref={shoutOut}
                className="shout" placeholder="..."
                type="textarea"
                value={currentPost?.content}
                onChange={handleChange}
                name="content" />
              <div className="input-group-append">

                <Button className="shout btn">shout</Button>
              </div>

            </div>
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
                {socialFeed?.pages?.filter((f: any) => !f.thread_id)
                  .map((mmm: any) => LiteralFood({
                    ...mmm,
                    profile,
                    replies: [
                      ...socialFeed?.pages?.filter((reply: any) => reply.parent_id === mmm.id),
                    ]
                  })) || []}
              </ul>
              {Paginator()}
            </>
        }
      </> :
      <><Label>ok then</Label></>
    }
  </div>)
}
export default Feed;
