import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../memory/hooks";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import relativeTime from 'dayjs/plugin/relativeTime';
import { BlogPost, selectors as postsSelectors, submitPostAsync, actions as postsActions } from '../thread/threadSlice';
import { getFeedAsync, selectors as feedSelectors, actions as feedActions } from './feedSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as authSelectors } from '../auth/authSlice'
import FeedCard from "../cards/FeedCard";
import { Form, FormGroup, Label, Input, Button, Container, Spinner } from 'reactstrap';

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const { selectProfile } = profileSelectors;
const { selectFeed } = feedSelectors;
const { selectToken } = authSelectors;
const { selectCurrent } = postsSelectors;

const { clear: clearFeed } = feedActions;
const { setCurrent } = postsActions;

function Feed(props: any) {
  let [searchParams,] = useSearchParams();
  const navigate = useNavigate();
  const socket = props?.socket;
  const profile = useAppSelector(selectProfile);
  const socialFeed: any = useAppSelector(selectFeed);
  const token = useAppSelector(selectToken);
  const authorized = token && token.length > 4;
  const shoutOut: any = useRef();
  const dispatch = useAppDispatch();
  const currentPost: BlogPost = useAppSelector(selectCurrent);
  const [state, setState] = useState({ lastLoaded: 0, page: searchParams.get('page') });
  const page = !socialFeed.previous ? 1 : socialFeed.previous.page + 1;

  const redirectVisitor = useCallback(() => {
    dispatch(clearFeed());
    navigate('/login');
  }, [dispatch, navigate]);

  const refreshFeed = useCallback(() => {
    setState({ lastLoaded: Date.now(), page: searchParams.get('page') });
    dispatch(getFeedAsync({ socket, page: searchParams.get('page'), limit: searchParams.get('limit') }));
  }, [setState, dispatch, searchParams, socket]);

  useEffect(() => {
    const delta = (Date.now() - state.lastLoaded);
    if (!authorized) {
      return redirectVisitor();
    }
    if (delta > 15000) {
      refreshFeed();
    }
  }, [redirectVisitor, refreshFeed, authorized, state.lastLoaded]);

  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    if (socialFeed.status !== "pending") {
      dispatch(submitPostAsync({ socket }));
      setTimeout(() => {
        dispatch(getFeedAsync({ socket, page: searchParams.get('page') }));
      }, 500);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name: string = e.currentTarget.name;
    let value = e.target.value;
    dispatch(setCurrent({ [name]: value }));
  }

  const turnPage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    dispatch(getFeedAsync({ socket, page: searchParams.get('page') }));
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
          socialFeed.status === 'loading' ?
            <Container className="centered-spinner-container">
              <Spinner />
            </Container>
            :
            <>
              <ul className="feedList">
                {socialFeed?.pages?.map((page: any) => FeedCard({
                  ...page,
                  profile,
                  replies: [
                    ...socialFeed?.pages?.filter((reply: any) => reply.parent_id === page.id),
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
