import React, {useEffect, useState} from 'react';
import {propsWithWebSocket} from './common'
import { selectors as webSocketSelectors } from '../network/socketSlice';
import { useAppDispatch, useAppSelector } from '../../memory/hooks'
import Feed from '../feed/Feed';
const { selectMessage, selectStatus } = webSocketSelectors; // TODO: update for socketio

function MainPage({ ws, ...props }:propsWithWebSocket) {
    const status = useAppSelector(selectStatus);
    const message = useAppSelector(selectMessage);
    const [messageSent, setMessageSent] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (ws && !messageSent) {
            setMessageSent(true);
        };
    }, [ws, messageSent, dispatch, message, status]);
    return (<Feed />)
}

export default MainPage;

