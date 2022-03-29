import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

  
    const handleSubmit = () => {
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      };
      fetch("https://charitable-gaming-server.herokuapp.com/api/login", requestOptions)
          .then(res => {
            console.log('Submitted successfully');
            navigate('/dashboard');
          })
          .catch(err => console.log(err.message))
    };

    return (  
        <Form className="centered login-form-container">

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={ (e) => setEmail(e.target.value) }/>
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={ (e) => setPassword(e.target.value) } />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>

            <Button variant="primary" onClick={ handleSubmit }>
                Submit
            </Button>

        </Form>
    );
}
 
export default Login;