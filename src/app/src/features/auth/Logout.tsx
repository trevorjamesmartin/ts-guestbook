import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../memory/hooks';
import { logoutAsync, actions as authAction } from '../auth/authSlice';
import { actions as webSocketActions } from '../network/socketSlice';
import { actions as profileActions, selectors as profileSelectors } from '../profile/profileSlice'
const { setStatusDisconnected } = webSocketActions;
const { logout } = authAction
const { clear: clearProfile } = profileActions;
const { selectProfile } = profileSelectors;
export function Logout(props: any) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfile);
    const message: string = `logout:${profile.username}`;
    const socket = props.socket;
    const goodbye = useCallback(async () => {
        dispatch(clearProfile())
        await dispatch(logoutAsync()) && // logout (serverside)
        dispatch(setStatusDisconnected(socket, message)) // logout (client side)
        dispatch(logout());
        setTimeout(() => {
            navigate('/');
        }, 500); // reload to trigger a websocket connection
    }, [dispatch, message, navigate, socket]);

    useEffect(() => {
        goodbye();
    }, [goodbye]);
    return (<h4>GoodBye</h4>)
}
