import React from 'react';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { useState } from 'react';

const Layout = ({ children }) => {

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setDarkMode(savedMode === 'true');
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    return (
        <div className={`min-h-screen bg-gray-100 ${darkMode ? 'dark:bg-gray-950' : ''}`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="w-full">
                {children}
            </main>
        </div>
    );
};

export default Layout;
