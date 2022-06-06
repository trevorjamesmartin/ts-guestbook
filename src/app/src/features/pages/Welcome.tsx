import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from 'reactstrap';
import Delay from "../network/Delay";
import { selectors as authSelectors } from '../auth/authSlice'
import { propsWithWebSocket } from './common'
import { useAppSelector } from "../../memory/hooks";
const { selectLoggedIn } = authSelectors;
function Welcome({ ws, ...props }: propsWithWebSocket) {
    const loggedIn = useAppSelector(selectLoggedIn);
    const [showLanding, setShowLanding] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            (loggedIn) ? navigate('/app') : setShowLanding(true);
        }, 500);
    }, [ws])
    return (<Container>
        {!showLanding ? <Delay timeout={2000} /> : <>
            <div>
                <h1>Meow now</h1>
                <br />
                <h4>Join Guestbook today.</h4>
                <div className="sign-in-up-div">
                    <Link className="sign-up-link" to="/register">Sign up</Link>
                    <br />
                    <p className="signed-up-already">Already have an account ?</p>
                    <Link className="sign-in-link" to="/login">Sign In</Link>
                </div>
                <hr />

                <div className="about-img-div-r">
                    <p className="about-text">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda vitae, suscipit eius inventore excepturi, explicabo aut qui harum expedita at saepe possimus quo ab dolorum dicta debitis aperiam quod itaque.</p>
                    <img alt="kitten" className="about-img" src="https://placekitten.com/300/300"></img>
                </div>
                <div className="about-img-div">
                    <p className="about-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus facere, officia quia iure recusandae sequi ea illo tenetur? At a accusamus ducimus atque incidunt labore eius ipsum dignissimos pariatur veritatis?</p>

                    <img alt="kitten" className="about-img" src="https://placekitten.com/400/400"></img>
                </div>
            </div>
        </>}
    </Container>)
}

export default Welcome