// import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from "react-bootstrap/Container";


const NavigationBar = () => {
    return (  
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/dashboard">
            {/* <img
                src={'/gameboy.png'}
                alt="Logo"
                width="40"
                height="40"
                className="d-inline-block align-top"
            /> */}
            CharitableGaming
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/charities">Charities</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}
 
export default NavigationBar;