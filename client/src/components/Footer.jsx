import React from 'react'

const Footer = ({ darkMode, setDarkMode }) => {
    return (

        <footer className={`w-full p-2 ${darkMode ? 'border-gray-700 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-400' : 'border-gray-300 bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50 text-gray-700'} border-t text-center`}>

            <div className="flex md:flex-row flex-col  items-center p-2 md:justify-between space-y-2">
                <p className='md:text-sm text-xs'>Built with ❤️ by the FU | GOALS Team.</p>
                <p className='md:text-sm md:block hidden text-xs'>
                    <a href="https://github.com/Grealishgit/CasandraDB" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6634E2]">GitHub Repository</a>
                </p>
                <p className='md:text-sm text-xs'>&copy; {new Date().getFullYear()} FU | GOALS. All rights reserved.</p>
            </div>
        </footer>

    )
}

export default Footer