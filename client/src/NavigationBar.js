import { Link } from "react-router-dom";
/* This example requires Tailwind CSS v2.0+ */
const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Charities', href: '/charities' },
    { name: 'Leaderboard', href: '/leaderboard' }
]

export default function NavigationBar() {
    return (
        <header className="bg-indigo-600">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
                    <div className="flex items-center">
                        <Link to="/">
                            <span className="sr-only">Charitable Gaming</span>
                            <img
                                className="h-10 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                                alt=""
                            />
                        </Link>
                        <div className="hidden ml-10 space-x-8 lg:block">
                            {navigation.map((link) => (
                                <Link key={link.name} to={link.href} className="text-base font-medium text-white hover:text-indigo-50">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="ml-10 space-x-4">
                        <Link
                            to="/login"
                            className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                        >
                            Register
                        </Link>
                    </div>
                </div>
                <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
                    {navigation.map((link) => (
                        <Link key={link.name} to={link.href} className="text-base font-medium text-white hover:text-indigo-50">
                            {link.name}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    )
}