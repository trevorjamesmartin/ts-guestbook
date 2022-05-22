import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { usersAsync, selectors } from './userSlice';
import { selectors as friendSelectors, friendRequestAsync } from '../social/friendSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { Card, CardImg, CardTitle, CardLink, Row, Col, Button, Container, CardBody, CardText, Label } from 'reactstrap';
const selectList = selectors.selectList;
// const selectStatus = selectors.selectStatus;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;
const { selectProfile } = profileSelectors;
// const LIMIT_RELOAD_USERS = 1000 * 15;

const UserCard = (props: any) => {
  const { data, dispatcher, isFriend, requestedConnect } = props;
  return <Card key={data.username} className="userlist-card">
    <Container className='userlist-body-wrap'>
      <CardBody className="d-flex flex-column align-items-center text-center">
        <CardImg
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/user.png";
          }}
          className="rounded-circle avatar-thumb"
          src={data.avatar || '/user.png'}
          alt={`${data.username}'s avatar`}
        />
        <div className='mt-3'>
          <CardText className='text-secondary' >{data.name || "  "}</CardText>
          <CardTitle className='text-primary text-monospace'>{data.username}</CardTitle>
          {(!isFriend && !requestedConnect) ? <Button onClick={() => {
            dispatcher(friendRequestAsync(data));
          }}>add friend*</Button> :
            <button className="btn btn-outline-primary">Message</button>}
          {requestedConnect && (<CardText className="p-requested">requested</CardText>)}
        </div>
      </CardBody>
    </Container>
  </Card>
}

export function UserList(props:any) {
  const dispatch = useAppDispatch();
  const socket = props?.socket;
  const userlist: any = useAppSelector(selectList);
  // const status = useAppSelector(selectStatus);
  const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const profile = useAppSelector(selectProfile);
  let [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ lastLoaded: 0, page: searchParams.get('page') });
  useEffect(() => {
    const delta = (Date.now() - state.lastLoaded);
    if (delta > 15000) {
      setState({ lastLoaded: Date.now(), page: searchParams.get('page') });
      dispatch(usersAsync({socket, page: searchParams.get('page')}));
    }

  }, [userlist.pages, searchParams]);
  const page = !userlist.previous ? 1 : userlist.previous.page + 1;

  const nextPage = (e: any) => {
    e.preventDefault();
    switch (e.currentTarget.name) {
      case 'next':
        searchParams.set('page', userlist.next.page);
        break;
      case 'previous':
        searchParams.set('page', userlist.previous.page);
        break;      
      default:
        return
    }
    setState({ lastLoaded: Date.now(), page: searchParams.get('page') });
    dispatch(usersAsync({socket, page: searchParams.get('page')}));
  };
  function Paginator() {
    return <Container className="paginator flex align-items-center text-center" hidden={!(userlist.next || userlist.previous)} >
      {!userlist?.previous?.page || page === 1 ?
        <Button className="paginator btn" disabled>⇦</Button> :
        <Button name="previous" className="paginator btn btn-success"
          onClick={nextPage}
        >⇦</Button>}
      <Label>{page}</Label>
      {!userlist?.next?.page ?
        <Button className="paginator btn" disabled>⇨</Button> :
        <Button name="next" className="paginator btn btn-success"
          onClick={nextPage}
        >⇨</Button>}
    </Container>
  }

  return (<>
    <Label>Who's who?</Label>

    <Container className='userlist-container'>
      {userlist.pages.map((user: any, i: number) => {
        if (profile.username === user.username) {
          return null
        };
        const isFriend = friendList.find((friend: any) => friend.username === user.username);
        const requestedConnect = friendRequests.find((req: any) => req.username === user.username);
        return <UserCard
          dispatcher={dispatch}
          requestedConnect={requestedConnect}
          isFriend={isFriend}
          data={user}
          key={i}
        />
      })}

    </Container>
    {Paginator()}

  </>);
}
