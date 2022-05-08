import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner } from 'reactstrap';
import { propsWithWebSocket } from './common'

function Welcome({ ws, ...props }: propsWithWebSocket) {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            if (ws) {
                navigate('/app')
            } else {
                navigate('/logout')
            }
        }, 500);
    }, [ws])
    return (<Container>
        <div className="spinner-wrap">
            {<Spinner center />}
        </div>
    </Container>)
}

export default Welcome