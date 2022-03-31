import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from 'react-bootstrap/Nav';
import Container from "react-bootstrap/Container";

const NavigationBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetch(`https://charitable-gaming-server.herokuapp.com/api/is_user_logged_in`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                setIsLoggedIn(data["logged_in"])
            })
    }, []);

    return ( 
        <Navbar collapseOnSelect className="navbar border-bottom" expand="md">
            <Container>
                <Navbar.Brand href="/dashboard">
                    <img className="logo" src="logo.svg" alt="logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="nav-links ml-auto justify-content-evenly">
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/charities">Charities</Nav.Link>
                        <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
                        {isLoggedIn ? 
                            <Button>Logout</Button> :
                            <Nav.Link href="/login">Login</Nav.Link>
                        }
                    </Nav> 
                </Navbar.Collapse>

                {/* <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link href="#action1">Home</Nav.Link>
                    <Nav.Link href="#action2">Link</Nav.Link>
                    <NavDropdown title="Dropdown" id="offcanvasNavbarDropdown">
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">
                        Something else here
                        </NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                </Offcanvas.Body>
                </Navbar.Offcanvas>*/}
            </Container>
        </Navbar>
    );
}

export default NavigationBar;