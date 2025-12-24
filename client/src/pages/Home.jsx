import { BadgePercentIcon, Calendars, CircleCheckBig, ListCheck } from 'lucide-react';
import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { goalsAPI } from '../api/goals';
// import { quotes } from '../lib/quotes';
import { useState } from 'react';
import { useEffect } from 'react';

const Home = () => {
    const [quote, setQuote] = useState({ text: '', author: '' });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useOutletContext() || { darkMode: false };
    const { user, logout } = useAuth();

    const greeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) return 'Good Morning';
        if (currentHour < 18) return 'Good Afternoon';
        return 'Good Evening';
    }

    const navigate = useNavigate();

    // useEffect(() => {
    //     const randomIndex = Math.floor(Math.random() * quotes.length);
    //     setQuote(quotes[randomIndex]);
    // }, []);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await goalsAPI.getGoalStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={`w-full min-h-screen mt-16  justify-center items-center
        ${darkMode ? 'bg-linear-to-tr from-gray-950 via-gray-900 to-gray-950 text-white' :
                'bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50'} flex flex-col items-center`}>

            <div className='text-center mt-5 px-4'>
                <h2 className='md:text-5xl text-4xl font-semibold'>{greeting()} 👋 <span className='text-[#6634E2] capitalize'>{user?.username || user?.email || 'User'}</span></h2>
                <p className={`md:text-md text-sm mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Bring your goals to life with FU | GOALS - your personal goal management companion.
                </p>
            </div>

            <div className='flex mt-6'>
                <button onClick={() => navigate('/create-goal')}
                    className='px-5 cursor-pointer py-2 bg-[#6634E2] text-white rounded-md hover:bg-[#7954d8] transition duration-200'>
                        Create New Goal

                </button>
                <button onClick={() => navigate('/goals')}
                    className={`ml-4 ${darkMode ? 'text-black bg-gray-200' : 'text-gray-200 bg-gray-800'} cursor-pointer px-5 font-semibold py-2
                          rounded-md hover:bg-gray-400 transition duration-200`}>
                        View Goals

                </button>
            </div>

            {/* Quick summary in 4 stats cards */}
            <div className='w-full max-w-5xl mt-10 grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-2 px-4'>
                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>Total Goals</h3>
                        <ListCheck />
                    </div>

                    <p className='text-4xl text-center mt-2 font-bold'>
                        {loading ? '...' : stats?.totalGoals || 0}
                    </p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-green-500 mt-5 md:text-lg text-center text-sm font-semibold'>+3%</span> since last week
                    </p>
                </div>

                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>Completed</h3>
                        <CircleCheckBig />
                    </div>

                    <p className='text-4xl text-center mt-2 font-bold'>
                        {loading ? '...' : stats?.completedGoals || 0}
                    </p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-green-500 font-semibold'>+5%</span> since last week
                    </p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>In Progress</h3>
                        <BadgePercentIcon />
                    </div>
                    <p className='text-4xl  text-center mt-2 font-bold'>
                        {loading ? '...' : stats?.inProgressGoals || 0}
                    </p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-green-500 mt-2 font-semibold'>+2%</span> since last week
                    </p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <div className='flex items-center justify-between gap-2 w-full'>
                        <h3 className='text-lg font-semibold'>Overdue </h3>
                        <Calendars />
                    </div>
                    <p className='text-4xl text-center mt-2 font-bold'>
                        {loading ? '...' : stats?.overdueGoals || 0}
                    </p>
                    <p className='text-center md:text-md text-sm'>
                        <span className='text-red-500 mt-2 font-semibold'>+1%</span> since last week
                    </p>
                </div>
            </div>

            {/* Random Quote Section */}
            {/* <div className={`w-full max-w-3xl mt-10 p-6 rounded-lg shadow-md
            ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <h3 className='text-md font-semibold mb-4'>Motivational Quote</h3>
                <p className='italic text-center md:text-md text-sm'>
                    "{quote.text}"
                </p>
                <p className='text-right font-semibold text-[#6634E2] mt-4'>- {quote.author}</p>
            </div> */}

            {/* Card left infomation, right yearly distribution of goals */}
            <div className='w-full max-w-6xl mt-10 px-4 mb-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* Left Card - Summary Information */}
                    <div className={`p-5 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h3 className='text-2xl font-bold mb-4'>Your Progress</h3>
                        <div className='space-y-4'>
                            <div className='border-t border-gray-300 dark:border-gray-600 pt-4'>
                                <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                                    {loading ? 'Loading progress...' : stats?.totalGoals > 0 ? "You're making great progress! Keep up the momentum." : "Start creating goals to track your progress!"}
                                </p>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span>Completion Rate</span>
                                        <span className='font-semibold'>
                                            {loading ? '...' : `${stats?.successRate || 0}%`}
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                                        <div className='bg-[#6634E2] h-2 rounded-full' style={{ width: `${stats?.successRate || 0}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>This Month</p>
                                    <p className='text-xl font-bold'>
                                        {loading ? '...' : `${stats?.thisMonthGoals || 0} Goals`}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Success Rate</p>
                                    <p className='text-xl font-bold'>
                                        {loading ? '...' : `${stats?.successRate || 0}%`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card - Yearly Distribution Bar Chart */}
                    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='text-xl font-bold'>Yearly Distribution</h3>
                            <div className='flex items-center gap-2 text-sm'>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Goals</span>
                                <span className='text-2xl font-bold text-[#6634E2]'>
                                    {loading ? '...' : stats?.monthlyDistribution?.reduce((acc, goal) => acc + goal.goals, 0) || 0}
                                </span>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className='relative h-48 mt-4'>
                            {/* Y-axis labels */}
                            {!loading && stats?.monthlyDistribution && (
                                <div className='absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500 pr-2 pb-6' style={{ height: 'calc(100% - 24px)' }}>
                                    {(() => {
                                        const maxGoals = Math.max(...stats.monthlyDistribution.map(g => g.goals), 1);
                                        const step = Math.ceil(maxGoals / 5);
                                        return Array.from({ length: 6 }, (_, i) => step * (5 - i)).map(num => (
                                            <span key={num}>{num}</span>
                                        ));
                                    })()}
                                </div>
                            )}

                            {/* Chart container */}
                            <div className='flex items-end justify-between h-full gap-1 ml-6 pb-6'>
                                {loading ? (
                                    <div className='w-full text-center text-gray-500'>Loading chart...</div>
                                ) : stats?.monthlyDistribution && stats.monthlyDistribution.length > 0 ? (
                                    stats.monthlyDistribution.map((item) => {
                                        const maxGoals = Math.max(...stats.monthlyDistribution.map(g => g.goals), 1);

                                        return (
                                            <div key={item.id} className='flex flex-col items-center flex-1 h-full'>
                                                {/* Spacer to push bar to bottom, with goal count */}
                                                <div className='flex-1 flex flex-col justify-end'>
                                                    <span className={`text-xs font-bold text-center mb-1 ${new Date().toLocaleString('default', { month: 'long' }) === item.month ? 'text-[#6634E2]' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {item.goals}
                                                    </span>
                                                </div>

                                                {/* The bar itself - proportional to maxGoals */}
                                                <div
                                                    className={`w-full rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer relative group
                                                        ${new Date().toLocaleString('default', { month: 'long' }) === item.month ? 'bg-[#6634E2]' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                                                    style={{
                                                        height: item.goals > 0 ? `${(item.goals / maxGoals) * 100}%` : '2px',
                                                        minHeight: item.goals > 0 ? '4px' : '2px'
                                                    }}
                                                >
                                                    {/* Tooltip on hover */}
                                                    {item.goals > 0 && (
                                                        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10'>
                                                            {item.goals} goals, {item.completed} completed
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Month label */}
                                                <span className={`text-xs mt-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {item.month.slice(0, 3)}
                                                </span>
                                            </div>
                                        );
                                    })
                                    ) : (
                                    <div className='w-full text-center text-gray-500'>No data available</div>
                                )}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className='flex justify-center gap-6 mt-6 text-sm'>
                            <div className='flex items-center gap-2'>
                                <div className='w-3 h-3 rounded-full bg-[#6634E2]'></div>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Month</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Other Months</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home