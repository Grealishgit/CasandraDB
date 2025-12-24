import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Target, Sun, Moon } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className={`w-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b shadow-lg`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/home" className="flex items-center space-x-2">
                            <Target className="h-8 w-8 text-[#6634E2]" />
                            <span className={`${darkMode ? 'text-white' : 'text-black'}  text-xl font-bold`}>
                                FU | <span className="text-[#6634E2]">GOALS</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/home"
                            className={`${darkMode ? 'text-white' : 'text-gray-800 '} font-semibold hover:text-[#6634E2] transition duration-200`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/goals"
                            className={`${darkMode ? 'text-white' : 'text-gray-800 '} font-semibold hover:text-[#6634E2] transition duration-200`}
                        >
                            My Goals
                        </Link>
                        <Link
                            to="/create-goal"
                            className={`${darkMode ? 'text-white' : 'text-gray-800 '} font-semibold hover:text-[#6634E2] transition duration-200`}
                        >
                            Create Goal
                        </Link>
                        <Link
                            to="/profile"
                            className={`${darkMode ? 'text-white' : 'text-gray-800 '} font-semibold hover:text-[#6634E2] transition duration-200`}
                        >
                            Profile
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* User Info */}
                        <div className={`hidden md:flex ${darkMode ? 'text-white' : 'text-gray-800'} items-center space-x-2`}>
                            <User className="h-5 w-5" />
                            <span className={`${darkMode ? 'text-white' : 'text-gray-800 '} text-sm`}>
                                {user?.username || user?.email || 'User'}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-1.5 cursor-pointer bg-[#6634E2] 
                            text-white rounded-md hover:bg-[#7954d8] transition duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? (
                                <Moon className={`${darkMode ? 'text-white' : 'text-gray-800 '} font-semibold hover:text-[#6634E2] transition duration-200`} />
                            ) : (
                                <Sun className={`${darkMode ? 'text-white' : 'text-gray-800 '} font-semibold hover:text-[#6634E2] transition duration-200`} />
                            )}
                            <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {darkMode ? 'Dark' : 'Light'} Mode</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden pb-4 border-t border-gray-300 space-y-2">
                    <Link
                        to="/home"
                        className="block text-gray-800 font-semibold hover:text-[#6634E2] py-2 transition duration-200"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/goals"
                        className="block text-gray-800 font-semibold hover:text-[#6634E2] py-2 transition duration-200"
                    >
                        My Goals
                    </Link>
                    <Link
                        to="/create-goal"
                        className="block text-gray-800 font-semibold hover:text-[#6634E2] py-2 transition duration-200"
                    >
                        Create Goal
                    </Link>
                    {/* Mobile User Info */}
                    <div className="flex items-center space-x-2 text-gray-800 py-2">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-semibold text-[#6634E2]">
                            {user?.username || user?.email || 'User'}
                        </span>
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;