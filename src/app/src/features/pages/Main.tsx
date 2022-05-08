import React, {useEffect, useState} from 'react';
import {propsWithWebSocket} from './common'
import { sendMessage, selectors as webSocketSelectors } from './wsSlice';
import { useAppDispatch, useAppSelector } from '../../memory/hooks'

import Feed from '../feed/Feed';
// import Profile from '../profile/Profile';
// import Posts from '../posts/Posts'; 
const { selectSentMessage, selectSentStatus } = webSocketSelectors;

function MainPage({ ws, ...props }:propsWithWebSocket) {
    const status = useAppSelector(selectSentStatus);
    const message = useAppSelector(selectSentMessage);
    const [messageSent, setMessageSent] = useState(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log({ message, status });
        if (ws && !messageSent) {
            setMessageSent(true);
            console.log('sending message back to host...', Date.now());
            dispatch(sendMessage({ ws, message: 'MainPage' }));
        } else if (!ws) {
            console.log("NO WS")
        } else {
            console.log("OK")
        };
    }, [ws, messageSent, dispatch, message, status]);
    return (<Feed />)
}

export default MainPage;

