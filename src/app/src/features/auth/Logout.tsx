import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../auth/authSlice';
import { actions } from '../pages/wsSlice';

const { setStatusDisconnected } = actions;

export function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(logoutAsync()); // logout (serverside)
        dispatch(setStatusDisconnected())// logout (client side)
        navigate('/login');
        setTimeout(() => window.location.reload(), 500); // reload to trigger a websocket connection
    }, []);
    return (<></>)
}
