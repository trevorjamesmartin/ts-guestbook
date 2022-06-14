import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { usersAsync, selectors } from './userSlice';
import { selectors as friendSelectors, friendRequestAsync } from '../social/friendSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { selectors as socketSelectors } from '../network/socketSlice';
import { Card, CardImg, CardTitle, Button, Container, CardBody, CardText, Label } from 'reactstrap';
const selectAvailableUsers = socketSelectors.selectUserlist;
const selectList = selectors.selectList;
// const selectStatus = selectors.selectStatus;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;
const { selectProfile } = profileSelectors;
// const LIMIT_RELOAD_USERS = 1000 * 15;

export const UserCard = (props: any) => {
  const { selected, isOnline, data, dispatcher, isFriend, requestedConnect, onClick } = props;
  useEffect(() => {
  }, [isOnline])
  return <Card
    onClick={onClick}
    key={data.username}
    className={`${isOnline ? "userlist-card" : "userlist-card-offline"}${selected ? "-selected" : ""}`}
  >
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
            isOnline ?
              <Link to={`/app/users/${data.username}?msg=${String(Date.now())}`}>Message</Link> :
              // <button className="btn btn-outline-primary">Message</button> : 
              <span className='user-offline'>offline</span>}
          {requestedConnect && (<CardText className="p-requested">requested</CardText>)}
        </div>
      </CardBody>
    </Container>
  </Card>
}

export default function UserList(props: any) {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState<string>();
  const dispatch = useAppDispatch();
  const availableUsers = useAppSelector(selectAvailableUsers);
  const socket = props?.socket;
  const userlist: any = useAppSelector(selectList);
  // const status = useAppSelector(selectStatus);
  const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const profile = useAppSelector(selectProfile);
  const [searchParams, setSearchParams] = useSearchParams({});

  const page = !userlist.previous ? 1 : userlist.previous.page + 1;

  const refreshPage = useCallback(async () => {
    const n = searchParams.get('page');
    await dispatch(usersAsync({ socket, page: n }));
  }, [searchParams]);

  useEffect(() => {
    refreshPage();
  }, [refreshPage]);


  const nextPage = (e: any) => {
    e.preventDefault();
    switch (e.currentTarget.name) {
      case 'next':
        setSearchParams({ page: userlist.next.page })
        break;
      case 'previous':
        setSearchParams({ page: userlist.previous.page })
        break;
      default:
        return
    }
    dispatch(usersAsync({ socket, page: searchParams.get('page') }));
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
        const isOnline = availableUsers.includes(user.username);
        const isFriend = friendList.find((friend: any) => friend.username === user.username);
        const requestedConnect = friendRequests.find((req: any) => req.username === user.username);
        return <UserCard
          dispatcher={dispatch}
          requestedConnect={requestedConnect}
          isFriend={isFriend}
          isOnline={isOnline}
          data={user}
          key={i}
          selected={clicked === user.username}
          onClick={async (e: any) => {
            e.preventDefault();
            if (clicked === user.username) {
              navigate(`/app/users/${user.username}`);
            }
            setClicked(user.username);
            console.log(user.username);
          }}
        />
      })}

    </Container>
    {Paginator()}

  </>);
}
