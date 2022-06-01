import React, { useEffect } from "react";
import { Container, Label, NavLink, NavItem } from 'reactstrap';

function About() {
    return <Container>
        <Label>About this project</Label>
        <NavLink target="_blank" href="/swagger">
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