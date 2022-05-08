import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { usersAsync, selectors } from './userSlice';
import { selectors as friendSelectors, friendRequestAsync } from '../social/friendSlice';
import { selectors as profileSelectors } from '../profile/profileSlice';
import { Button } from 'reactstrap';
const selectList = selectors.selectList;
const selectStatus = selectors.selectStatus;
const { selectRequestsRecieved, selectFriendList } = friendSelectors;
const { selectProfile } = profileSelectors;
// const LIMIT_RELOAD_USERS = 1000 * 15;

export function UserList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userlist = useAppSelector(selectList);
  // const status = useAppSelector(selectStatus);
  const friendList = useAppSelector(selectFriendList);
  const friendRequests = useAppSelector(selectRequestsRecieved);
  const profile = useAppSelector(selectProfile);
  const [state, setState] = useState({ lastLoaded: 0 });
  const delta = (Date.now() - state.lastLoaded);
  useEffect(() => {
    // if (status === 'failed') {
    //   return navigate('/app/logout');
    // }
    if (delta > 15000) {

      console.log('userlist', userlist, {delta})
      setState({ lastLoaded: Date.now() });
      dispatch(usersAsync());
    }
  }, []);
  const handleAddFriend = (user: any) => {
    console.log(`send friend request to ${user.username}`)
    dispatch(friendRequestAsync(user));
  }
  return (<>
    <ul>
      {userlist.map((user, i) => {
        let { username, name, avatar, dob, email } = user;
        if (profile.username === username) {
          return null
        };
        let isFriend = friendList.find((friend: any) => friend.username === username);
        let requested = friendRequests.find((req:any)=> req.username === username);
        // console.log({
        //   friendList,
        //   isFriend
        // })
        return (
          <li key={i}>
            <img src={avatar || '/user.png'} width='18px' alt={`${username}'s avatar`} />
            {` - ${username}`}
            {!isFriend && !requested && <Button onClick={() => handleAddFriend(user)}>add friend</Button>}
          </li>)
      })}
    </ul>
  </>);
}
