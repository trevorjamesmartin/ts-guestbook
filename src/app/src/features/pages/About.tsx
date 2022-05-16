import React, { useEffect } from "react";
import { Container, Label, NavLink, NavItem } from 'reactstrap';

function About() {
    return <>
        <Label>Why not?</Label>
        <NavLink target="_blank" href="https://github.com/trevorjamesmartin/vigilant-cloud">
            <NavItem>
                Source Code
            </NavItem>
        </NavLink>
    </>
}

export default About