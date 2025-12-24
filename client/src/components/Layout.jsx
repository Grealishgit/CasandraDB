import React from 'react';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = ({ children }) => {

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setDarkMode(savedMode === 'true');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    return (
        <div className={`min-h-screen  ${darkMode ? 'dark:bg-gray-950' : 'bg-gray-100'}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className={`flex-1 ${darkMode ? 'dark:bg-gray-950' : 'bg-gray-100'}`}>
                <Outlet context={{ darkMode, setDarkMode }} />
            </main>
            <Footer darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
    );
};

export default Layout;
