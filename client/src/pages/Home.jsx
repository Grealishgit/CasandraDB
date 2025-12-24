import { BadgePercentIcon, Calendars, CircleCheckBig, ListCheck } from 'lucide-react';
import React from 'react'
import { useOutletContext } from 'react-router-dom';

const Home = () => {
    const { darkMode } = useOutletContext();

    const greeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }

    return (
        <div className={`w-full h-screen mt-16  justify-center items-center
        ${darkMode ? 'bg-linear-to-tr from-gray-950 via-gray-900 to-gray-950 text-white' :
                'bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50'} flex flex-col items-center`}>

            <div className='text-center px-4'>
                <h2 className='md:text-5xl text-4xl font-semibold'>{greeting()} Hunter</h2>
                <p className={`md:text-md text-sm mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Bring your goals to life with FU | GOALS - your personal goal management companion.
                </p>
            </div>

            <div className='flex mt-6'>
                <button>
                    <span className='mt-6 px-5 cursor-pointer py-2.5 bg-[#6634E2] text-white rounded-md hover:bg-[#7954d8] transition duration-200'>
                        Create New Goal
                    </span>
                </button>
                <button>
                    <span className={`mt-6 ml-4 ${darkMode ? 'text-black bg-gray-200' : 'text-gray-200 bg-gray-800'} cursor-pointer px-5 font-semibold py-2.5
                          rounded-md hover:bg-gray-400 transition duration-200`}>
                        View Goals
                    </span>
                </button>
            </div>

            {/* Quick summary in 4 stats cards */}
            <div className='w-full max-w-5xl mt-10 grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-2 px-4'>
                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>Total Goals</h3>
                        <ListCheck />
                    </div>

                    <p className='text-4xl text-center mt-2 font-bold'>12</p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-green-500 mt-5 md:text-lg text-center text-sm font-semibold'>+3%</span> since last week
                    </p>
                </div>

                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>Completed</h3>
                        <CircleCheckBig />
                    </div>

                    <p className='text-4xl text-center mt-2 font-bold'>5</p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-green-500 font-semibold'>+5%</span> since last week
                    </p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>In Progress</h3>
                        <BadgePercentIcon />
                    </div>
                    <p className='text-4xl  text-center mt-2 font-bold'>4</p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-green-500 mt-2 font-semibold'>+2%</span> since last week
                    </p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>Overdue </h3>
                        <Calendars />
                    </div>
                    <p className='text-4xl text-center mt-2 font-bold'>3</p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-red-500 mt-2 font-semibold'>+1%</span> since last week
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Home