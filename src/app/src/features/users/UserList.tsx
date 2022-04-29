import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usersAsync, selectors } from './userSlice';
const selectList = selectors.selectList;
const selectStatus = selectors.selectStatus;

const LIMIT_RELOAD_USERS = 1000 * 60;

export function UserList() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userlist = useSelector(selectList);
    const status = useSelector(selectStatus);
    const [state, setState] = useState({ lastLoaded: 0 });
    useEffect(() => {
        if (status === 'failed') {
            return navigate('/app/logout');
        }
        if ((Date.now() - state.lastLoaded) > LIMIT_RELOAD_USERS) {
            setState({ lastLoaded: Date.now() });
            dispatch(usersAsync());
        }
    }, [status]);

    return (<>
        <ul>
            {userlist.map((user, i) => {
                let { username, name, avatar, dob, email } = user;
                return (
                <li key={i}>
                    <img src={avatar || '/user.png'} width='18px' alt={`avatar representing ${username}`}/>
                    {` - ${username}`}
                </li>)
            })}
        </ul>
    </>);
}
