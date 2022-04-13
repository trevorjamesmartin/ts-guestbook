import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions } from '../auth/authSlice';

const { logout } = actions

export function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(logout())
        navigate('/login');
    }, []);
    return (<></>)
}
