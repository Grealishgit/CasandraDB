import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { goalsAPI } from '../api/goals';
import { Calendar, Target, Filter, Plus, Search, Grid, List, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Goals = () => {
    const { darkMode } = useOutletContext() || { darkMode: false };
    const navigate = useNavigate();

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        fetchGoals();
    }, [filterStatus, filterCategory]);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (filterStatus !== 'all') {
                response = await goalsAPI.getGoalsByStatus(filterStatus);
            } else if (filterCategory !== 'all') {
                response = await goalsAPI.getGoalsByCategory(filterCategory);
            } else {
                response = await goalsAPI.getAllGoals();
            }

            setGoals(response.data || []);
            console.log('Fetched goals:', response.data);
        } catch (err) {
            console.error('Error fetching goals:', err);
            setError('Failed to load goals. Please try again.');
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredGoals = goals.filter(goal =>
        goal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteGoal = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await goalsAPI.deleteGoal(goalId);
                setGoals(goals.filter(goal => goal.goal_id !== goalId));
                toast.success('Goal deleted successfully!');
            } catch (err) {
                console.error('Error deleting goal:', err);
                toast.error('Failed to delete goal. Please try again.');
            }
        }
    };

    const getStatusConfig = (status) => {
        const configs = {
            'not_started': {
                bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
                label: 'Not Started',
                icon: '○'
            },
            'in_progress': {
                bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                label: 'In Progress',
                icon: '◐'
            },
            'completed': {
                bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
                label: 'Completed',
                icon: '✓'
            },
            'on_hold': {
                bg: 'bg-gradient-to-r from-yellow-500 to-amber-600',
                label: 'On Hold',
                icon: '⏸'
            },
            'cancelled': {
                bg: 'bg-gradient-to-r from-red-500 to-red-600',
                label: 'Cancelled',
                icon: '✕'
            },
        };
        return configs[status] || configs['not_started'];
    };

    const getCategoryConfig = (category) => {
        const configs = {
            'personal': { color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
            'professional': { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
            'health': { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
            'financial': { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
            'education': { color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
            'other': { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
        };
        return configs[category] || configs['other'];
    };

    const stats = {
        total: goals.length,
        completed: goals.filter(g => g.status === 'completed').length,
        inProgress: goals.filter(g => g.status === 'in_progress').length,
    };

    return (
        <div className={`min-h-screen pt-20 pb-10 p-4 items-center transition-colors duration-300 
             ${darkMode ? 'bg-linear-to-tr from-gray-950 via-gray-900 to-gray-950 text-white' :
                'bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50'}`}>


            <div className="max-w-7xl mx-auto">
            <div className={`flex justify-between items-center rounded-md p-2 
            ${darkMode ? 'bg-gradient-to-br border border-gray-800 from-gray-950 via-gray-900 to-gray-950'
                    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}  mb-5`}>
                <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r
                 from-[#6634E2] to-[#9b6dff] bg-clip-text text-transparent">
                    My Goals
                </h1>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <button
                        onClick={() => navigate('/create-goal')}
                        className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r
                         from-[#6634E2] to-[#7954d8] text-white rounded-md font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Goal
                    </button>
                </div>
            </div>
            <p className={`text-lg text-center mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Track your progress and achieve greatness
            </p>


                <div className='flex md:flex-row gap-3 flex-col'>
                    <div className="md:w-[65%] w-full mx-auto">
                    {/* Header with Stats */}
                    <div className="mb-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className={`p-5 rounded-md shadow-lg border backdrop-blur-sm 
                        ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Total Goals
                                        </p>
                                        <p className="text-3xl font-bold">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-md shadow-lg border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            In Progress
                                        </p>
                                        <p className="text-3xl font-bold">{stats.inProgress}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-md shadow-lg border backdrop-blur-sm ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Completed
                                        </p>
                                        <p className="text-3xl font-bold">{stats.completed}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className={`p-5 rounded-md shadow-xl border backdrop-blur-sm mb-8 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200'
                        }`}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                    <input
                                        type="text"
                                        placeholder="Search goals..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
                                            : 'bg-gray-50/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:bg-white'
                                            } focus:outline-none focus:ring-2 focus:ring-[#6634E2] focus:border-transparent`}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                        className={`w-full cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
                                        : 'bg-gray-50/50 border-gray-300 text-gray-800 focus:bg-white'
                                        } focus:outline-none focus:ring-2 focus:ring-[#6634E2] focus:border-transparent`}
                                >
                                    <option value="all">All Status</option>
                                    <option value="not_started">Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                        className={`w-full cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 ${darkMode
                                        ? 'bg-gray-700/50 border-gray-600 text-white focus:bg-gray-700'
                                        : 'bg-gray-50/50 border-gray-300 text-gray-800 focus:bg-white'
                                        } focus:outline-none focus:ring-2 focus:ring-[#6634E2] focus:border-transparent`}
                                >
                                    <option value="all">All Categories</option>
                                    <option value="personal">Personal</option>
                                    <option value="professional">Professional</option>
                                    <option value="health">Health</option>
                                    <option value="financial">Financial</option>
                                    <option value="education">Education</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex justify-end mt-2 gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                    className={`p-2.5 cursor-pointer rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                    ? 'bg-[#6634E2] text-white shadow-lg'
                                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                    className={`p-2.5 cursor-pointer rounded-lg transition-all duration-200 ${viewMode === 'list'
                                    ? 'bg-[#6634E2] text-white shadow-lg'
                                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>



                    {/* Error State */}
                    {error && (
                        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
                            }`}>
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/* Goals Display */}
                    {!loading && !error && (
                        <>
                            {filteredGoals.length === 0 ? (
                                <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'
                                        }`}>
                                        <Target className="w-12 h-12 opacity-50" />
                                    </div>
                                    <p className="text-2xl font-bold mb-2">No goals found</p>
                                    <p className="mb-6 text-lg">Start by creating your first goal!</p>
                                    <button
                                        onClick={() => navigate('/create-goal')}
                                        className="px-8 py-3 bg-gradient-to-r from-[#6634E2] to-[#7954d8] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        Create Goal
                                    </button>
                                </div>
                            ) : (
                                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4' : 'space-y-4'}>
                                    {filteredGoals.map((goal) => {
                                        const statusConfig = getStatusConfig(goal.status);
                                        const categoryConfig = getCategoryConfig(goal.category);

                                        return (
                                            <div
                                                key={goal.goal_id}
                                                className={`rounded-md shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                                                    }`}
                                                onClick={() => navigate(`/goals/${goal.goal_id}`)}
                                            >
                                                {/* Banner Image */}
                                                {goal.banner ? (
                                                    <div className="h-48 overflow-hidden relative">
                                                        <img
                                                            src={goal.banner}
                                                            alt={goal.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                    </div>
                                                ) : (
                                                    <div className={`h-48 bg-gradient-to-br from-[#6634E2]/20 to-[#7954d8]/20 flex items-center justify-center ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                                                        }`}>
                                                        <Target className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                                    </div>
                                                )}

                                                {/* Goal Content */}
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h3 className="text-xl font-bold line-clamp-1 flex-1 group-hover:text-[#6634E2] transition-colors">
                                                            {goal.title}
                                                        </h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig.bg} ml-2 whitespace-nowrap shadow-md`}>
                                                            {statusConfig.icon} {statusConfig.label}
                                                        </span>
                                                    </div>

                                                    <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {goal.description}
                                                    </p>

                                                    <div className="flex items-center justify-between text-sm mb-4">
                                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${categoryConfig.bg}`}>
                                                            <Target className={`w-4 h-4 ${categoryConfig.color}`} />
                                                            <span className={`capitalize font-medium ${categoryConfig.color}`}>
                                                                {goal.category}
                                                            </span>
                                                        </div>
                                                        {goal.target_date && (
                                                            <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                <Calendar className="w-4 h-4" />
                                                                <span className="text-xs">
                                                                    {new Date(goal.target_date).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/goals/${goal.goal_id}/edit`);
                                                            }}
                                                            className={`flex-1 py-2.5 rounded-lg font-medium transition-all duration-200 ${darkMode
                                                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                                }`}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteGoal(goal.goal_id);
                                                            }}
                                                            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                    <div className="md:w-[35%] w-full">
                    {/* Recent Added Goals */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Recently Added Goals</h2>
                        {goals.slice(0, 5).map((goal) => (
                            <div
                                key={goal.goal_id}
                                className={`rounded-md shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} mb-4`}

                                onClick={() => navigate(`/goals/${goal.goal_id}`)}
                            >
                                {/* Banner Image */}
                                {goal.banner ? (
                                    <div className="h-32 overflow-hidden relative">
                                        <img
                                            src={goal.banner}
                                            alt={goal.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                ) : (
                                    <div className={`h-32 bg-gradient-to-br from-[#6634E2]/20 to-[#7954d8]/20 flex items-center justify-center ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'
                                        }`}>
                                        <Target className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </div>
                                )}
                                {/* Goal Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold line-clamp-1 flex-1 group-hover:text-[#6634E2] transition-colors">
                                        {goal.title}
                                    </h3>
                                    <p className={`text-sm mt-2 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {goal.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-20">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#6634E2]"></div>
                        <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse"></div>
                    </div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading goals...</p>
                </div>
            )}
        </div>
    );
};

export default Goals;