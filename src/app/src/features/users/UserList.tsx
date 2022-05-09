import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { usersAsync, selectors } from './userSlice';
import { selectors as friendSelectors, friendRequestAsync } from '../social/friendSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { Card, CardImg, CardTitle, CardLink, Row, Col, Button, Container, CardBody, CardText } from 'reactstrap';
const selectList = selectors.selectList;
// const selectStatus = selectors.selectStatus;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;
const { selectProfile } = profileSelectors;
// const LIMIT_RELOAD_USERS = 1000 * 15;

const UserCard = (props: any) => {
  const { data, dispatcher, isFriend, requestedConnect } = props;
  return <Card key={data.username} className="userlist-card">
    <Container className='userlist-body-wrap'>
      <CardBody className='userlist-card-body'>
        <CardImg className='avatar-thumb' src={data.avatar || '/user.png'} alt={`${data.username}'s avatar`} />
        <CardTitle>@{data.username}</CardTitle>
        {!isFriend && !requestedConnect && <Button onClick={() => {
          dispatcher(friendRequestAsync(data));
        }}>add friend*</Button>}
        {isFriend && (<CardText>friend</CardText>)}
        {requestedConnect && (<CardText>requested</CardText>)}
      </CardBody>
    </Container>
  </Card>
}

export function UserList() {
  const dispatch = useAppDispatch();
  const userlist = useAppSelector(selectList);
  // const status = useAppSelector(selectStatus);
  const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const profile = useAppSelector(selectProfile);
  const [state, setState] = useState({ lastLoaded: 0 });
  useEffect(() => {
    const delta = (Date.now() - state.lastLoaded);
    if (delta > 15000) {
      setState({ lastLoaded: Date.now() });
      dispatch(usersAsync());
    }
  }, []);
  return (<>
    <Container className='userlist-container'>
      {userlist.map((user: any, i) => {
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
  </>);
}
