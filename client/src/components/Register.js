import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown';
import CharityList from './CharityList';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';



export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gamerhandles, setGamerHandles] = useState([]);
    const [charityList, setCharityList] = useState([]);
    const [charity, setCharity] = useState('');
    const [dropdownText, setDropdownText] = useState('Select a charity');

    useEffect(() => {
        fetch("https://charitable-gaming-server.herokuapp.com/api/get_all_charities")
        .then(res => {
            return res.json();
        })
        .then(charityList => {
            setCharityList(charityList);
        })
    }, []);

    const handleSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, gamerhandles, charity })
        };
        fetch("https://charitable-gaming-server.herokuapp.com/api/register", requestOptions)
            .then(res => console.log('Submitted successfully'))
            .catch(err => console.log("Error registering"))
    };

    return (
        <Form className="centered login-form-container">
            <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(e) => { setEmail(e.target.value); } } />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter email"
                    onChange={(e) => { setPassword(e.target.value); } } />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => { setConfirmPassword(e.target.value); } } />
            </Form.Group>

            <Dropdown className="mb-3">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    { dropdownText }
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {charityList.map((charity, i) => (
                        <Dropdown.Item key={i} onClick = {(e) => {
                            setDropdownText( charity.name );
                            setCharity( charity.name );
                        }
                        }>
                        { charity.name }
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>


            <Button
                variant="primary"
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </Form>
    )
}

