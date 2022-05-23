import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from 'reactstrap';
import Delay from "../network/Delay";
import { propsWithWebSocket } from './common'

function Welcome({ ws, ...props }: propsWithWebSocket) {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
                navigate('/app')
        }, 500);
    }, [ws])
    return (<Container>
        <Delay timeout={2000} />
    </Container>)
}

export default Welcome