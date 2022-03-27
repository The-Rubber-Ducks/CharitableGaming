import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import CharityList from './CharityList';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gamerHandle, setGamerHandle] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [charities, setCharities] = useState([]);

    useEffect(() => {
        fetch("https://charitable-gaming-server.herokuapp.com/api/get_all_charities")
        .then(res => {
            return res.json();
        })
        .then(charities => {
            setCharities(charities);
        })
    }, []);

    const handleSubmit = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        };
        fetch("https://charitable-gaming-server.herokuapp.com/api/register", requestOptions)
            .then(res => console.log('Submitted successfully'))
            .catch(err => console.log("Error registering"))
    };
    return (
        <>
            <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register as a new user</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already registered?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in to your account &rarr;
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="gamerHandle" className="block text-sm font-medium text-gray-700">
                                    League of Legends Summoner Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="gamerHandle"
                                        name="gamerHandle"
                                        autoComplete="current-password"
                                        value="Topo"
                                        required
                                        onChange={(e) => {
                                            setGamerHandle(...gamerHandle, {"League of Legends": e.target.value})
                                        }}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Select a game
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {charities.map((charity) => (
                                        <Dropdown.Item href="#/action-1">{ charity.name }</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={ handleSubmit }
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

