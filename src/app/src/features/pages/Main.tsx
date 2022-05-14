import React, {useEffect, useState} from 'react';
import {propsWithWebSocket} from './common'
import { selectors as webSocketSelectors } from './wsSlice';
import { useAppDispatch, useAppSelector } from '../../memory/hooks'
import Feed from '../feed/Feed';
const { selectSentMessage, selectSentStatus } = webSocketSelectors; // TODO: update for socketio

function MainPage({ ws, ...props }:propsWithWebSocket) {
    const status = useAppSelector(selectSentStatus);
    const message = useAppSelector(selectSentMessage);
    const [messageSent, setMessageSent] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log({ message, status });
        if (ws && !messageSent) {
            setMessageSent(true);
        };
    }, [ws, messageSent, dispatch, message, status]);
    return (<Feed />)
}

export default MainPage;

