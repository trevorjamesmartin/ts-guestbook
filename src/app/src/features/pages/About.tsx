import React from "react";
import { Container, Label, NavLink, NavItem } from 'reactstrap';

function About() {
    const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;

    return <Container>
        <Label>About this project</Label>
        <NavLink target="_blank" href={`${baseURL}/swagger`}>
            <NavItem>
                Open API 3.0 specification
            </NavItem>
        </NavLink>
        <NavLink target="_blank" href="https://github.com/trevorjamesmartin/ts-guestbook">
            <NavItem>
                Open source code
            </NavItem>
        </NavLink>
    </Container>
}

export default About