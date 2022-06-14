import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../memory/hooks';
import { selectors as userSelector, usersAsync } from '../users/userSlice';
import { Spinner, Label, Button, Container } from 'reactstrap';
import { selectors as friendSelectors, friendRequestAsync } from '../social/friendSlice';
import { selectors as socketSelectors } from '../network/socketSlice';
import Messenger from '../social/Messenger';
const { selectList } = userSelector;
const { selectUserlist: selectAvailableUsers } = socketSelectors;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;

function PublicProfile(props: any) {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const userlist = useAppSelector(selectList);
  const dispatch = useAppDispatch();
  const availableUsers = useAppSelector(selectAvailableUsers);
  const socket = props.socket;
  const [state, setState] = useState<any>();
  const [waiting, setWaiting] = useState(true);
  const [showMessenger, setShowMessenger] = useState(false);
  const { username } = params;
  const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const isOnline = username && availableUsers.includes(username);
  const isFriend = friendList.find((friend: any) => friend.username === username);
  const requestedConnect = friendRequests.find((req: any) => req.username === username);
  useEffect(() => {
    setWaiting(true);
    setState(userlist?.pages?.find(u => u.username === params.username));
    setTimeout(() => {
      setWaiting(false);
      let dt = searchParams.get('msg');
      if (dt) {
        setShowMessenger(true);
      }
      if (!state?.avatar) {
        dispatch(usersAsync({ socket, page: 1, limit: 250 }));
        setState(userlist?.pages?.find(u => u.username === params.username));
      }
    }, 200);
  }, []);
  const toggleMessenger = () => {
    if (!showMessenger) {
      setSearchParams({ msg: String(Date.now()) });
    } else {
      setSearchParams({});
    }
    setShowMessenger(!showMessenger);
  }

  return <Container>
    <Button onClick={() => navigate(-1)}>Back</Button>
    {waiting ? <Spinner /> :
      <div className='profile-image-frame'>
        <img alt={username} className='avatar-image' src={state?.avatar || '/user.png'}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "/user.png";
          }}
        />
        <h5>{state?.name || state?.username}</h5>
        <Label>{state?.username}</Label>
        <div className='mt-3'>
          {isOnline && <Button onClick={() => toggleMessenger()}>Private Message</Button>}
          {!isOnline && <span className='user-offline'>offline</span>}
        </div>
        {(!isFriend && !requestedConnect) && (<Button onClick={() => state?.username && dispatch(friendRequestAsync(state))}>add friend*</Button>)}
      </div>
    }
    <div className='mx-auto' style={{ width: '100%', maxWidth: '80ch' }}>
      {showMessenger ? <Messenger socket={props.socket} /> : null}
    </div>
  </Container>
}

export default PublicProfile;
