import React, { useEffect } from "react";
import { Container, Label, NavLink, NavItem } from 'reactstrap';

function About() {
    return <Container>
        <Label>Why not?</Label>
        <NavLink target="_blank" href="/swagger">
            <NavItem>
                Open API 3.0 specification
            </NavItem>
        </NavLink>
    </Container>
}

export default About