import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../auth/authSlice';
import { actions as webSocketActions } from '../pages/wsSlice';
import { actions as profileActions } from '../profile/profileSlice'
const { setStatusDisconnected } = webSocketActions;
const { clear: clearProfile } = profileActions;
export function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(clearProfile()) &&
        dispatch(logoutAsync()) && // logout (serverside)
        dispatch(setStatusDisconnected()) // logout (client side)
        setTimeout(() => window.location.reload(), 1700); // reload to trigger a websocket connection
        // setTimeout(() => {
        //     navigate('/');
        // }, 500); // reload to trigger a websocket connection
    }, []);
    return (<h4>GoodBye</h4>)
}
