import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Target, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ darkMode, setDarkMode }) => {

    const [showSidebar, setShowSidebar] = useState(false);

    const navigate = useNavigate();
    const { user, logout } = useAuth();


    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className={`w-full fixed top-0 z-999 left-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b shadow-lg`}>
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

                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden relative">

                    <div onClick={() => setShowSidebar(!showSidebar)}
                        className={` ${darkMode ? 'text-white bg-gray-700' : 'text-gray-800 bg-gray-200 '}
                         p-2 shadow-xl mt-2 rounded-md absolute -right-1 top-1 cursor-pointer`}>
                        {!showSidebar ? <ChevronDown /> : <ChevronUp />}
                    </div>


                    {showSidebar && (
                        <div className={`mt-2 border-t  
                        ${darkMode ? 'bg-gray-800 border-gray-100 text-white' : 'bg-gray-100 text-gray-800 border-gray-600'}  space-y-2  p-4`}>
                            <Link onClick={() => setShowSidebar(!showSidebar)}
                                to="/home"
                                className="block font-semibold py-2 hover:text-[#6634E2]  transition duration-200"
                            >
                                Home
                            </Link>
                            <Link onClick={() => setShowSidebar(!showSidebar)}
                                to="/goals"
                                className="block  font-semibold py-2 hover:text-[#6634E2]  transition duration-200"
                            >
                                My Goals
                            </Link>
                            <Link onClick={() => setShowSidebar(!showSidebar)}
                                to="/create-goal"
                                className="block font-semibold py-2 hover:text-[#6634E2]  transition duration-200"
                            >
                                Create Goal
                            </Link>
                            {/* Mobile User Info */}
                            <div className="flex items-center space-x-2 text-[#6634E2] py-2">
                                <User className="h-5 w-5" />
                                <span className="text-md font-semibold text-[#6634E2]">
                                    {user?.username || user?.email || 'User'}
                                </span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </nav >
    );
};

export default Navbar;