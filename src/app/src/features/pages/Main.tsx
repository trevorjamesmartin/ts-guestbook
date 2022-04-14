import React, {useEffect, useState} from 'react';
import {propsWithWebSocket} from './common'
import { sendMessage, selectors } from './wsSlice';
import { useAppDispatch, useAppSelector } from '../../memory/hooks'

const {selectSentMessage, selectSentStatus} = selectors;

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
        };
    }, []);
    return (<p>thank you for logging in.</p>)
}

export default MainPage;

