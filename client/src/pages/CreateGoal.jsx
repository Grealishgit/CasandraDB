import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { goalsAPI } from '../api/goals';
import { Upload, X, Image as ImageIcon, Calendar, Target, FileText, Tag, AlertCircle, Footprints, Tally1, Tally2, Tally3, Tally4, CirclePlus } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateGoal = () => {
    const navigate = useNavigate();
    const { darkMode } = useOutletContext() || { darkMode: false };

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        status: 'not_started',
        priority: 'medium',
        target_date: '',
        banner: '',
    });

    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            setBannerFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleRemoveBanner = () => {
        setBannerFile(null);
        setBannerPreview(null);
        setFormData(prev => ({ ...prev, banner: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            setError('Please enter a goal title');
            return;
        }

        if (!formData.description.trim()) {
            setError('Please enter a goal description');
            return;
        }

        if (!formData.category) {
            setError('Please select a category');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Upload banner if selected
            let bannerUrl = '';
            if (bannerFile) {
                const uploadResponse = await goalsAPI.uploadBanner(bannerFile);
                if (uploadResponse.success && (uploadResponse.data.url || uploadResponse.data.cdnUrl)) {
                    // Use the actual URL from Uploadcare response
                    bannerUrl = uploadResponse.data.url || uploadResponse.data.cdnUrl;
                }
            }

            // Create goal
            const goalData = {
                ...formData,
                banner: bannerUrl,
            };

            const response = await goalsAPI.createGoal(goalData);

            if (response.success) {
                toast.success('Goal created successfully!');
                navigate('/goals');
            } else {
                setError('Failed to create goal');
            }
        } catch (err) {
            console.error('Error creating goal:', err);
            setError(err.response?.data?.message || 'Failed to create goal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex pt-20 justify-center items-center pb-10 px-4 ${darkMode ? 'bg-linear-to-tr from-gray-950 via-gray-900 to-gray-950 text-white' :
            'bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50'}`}>


            <div className="flex items-center justify-center max-w-6xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex flex-col items-center mb-5">
                        <h2 className="md:text-5xl text-4xl font-semibold mb-2 mr-4">
                            Goal <span className="text-[#6634E2]">Creation</span>
                        </h2>
                        <p className={`text-center md:text-md text-sm max-w-2xl
                             ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Goals are the milestones on your journey to success.
                            Create, track, and achieve them with FU | GOALS!
                        </p>
                    </div>


                    {/* Two cards to show how to create a goal */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-5 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold mb-4">Step 1: Define Your Goal</h3>
                                <p className='flex items-center text-[#6634E2] gap-2'><Footprints /> <Tally1 /></p>
                            </div>

                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Clearly articulate what you want to achieve. A well-defined goal provides direction and motivation.
                            </p>
                        </div>

                        <div className={`p-5 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold mb-4">Step 2: Set Milestones</h3>
                                <p className='flex items-center text-[#6634E2] gap-2'><Footprints /> <Tally2 /></p>
                            </div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Break your goal into smaller, manageable milestones. This helps track progress and stay motivated.
                            </p>
                        </div>

                        {/* Centered Create Goal Button - Positioned in the center of the grid */}
                        <div className="absolute md:block hidden top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform hover:scale-110"
                            >
                                <div className={`w-20 h-20 rounded-full bg-[#6634E2] hover:bg-[#7954d8] flex items-center justify-center transition duration-200 shadow-2xl border-4  ${darkMode ? 'border-gray-700' : 'border-none'} `}>
                                    <CirclePlus className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </div>

                            </button>
                        </div>

                        <div className={`p-5 rounded-lg shadow-lg ${darkMode ? 'bg-[#1e2939]' : 'bg-white'}`}>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold mb-4">Step 3: Review and Adjust</h3>
                                <p className='flex items-center text-[#6634E2] gap-2'><Footprints /> <Tally3 /></p>
                            </div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Regularly review your progress and adjust your strategies as needed. Flexibility is key to overcoming challenges.
                            </p>
                        </div>
                        <div className={`p-5 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>

                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold mb-4">Step 4: Celebrate Your Success</h3>
                                <p className='flex items-center font-semibold text-[#6634E2] gap-2'><Footprints /> <Tally4 /></p>
                            </div>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Acknowledge your achievements and reward yourself. Celebrating success boosts motivation for future goals.
                            </p>
                        </div>

                    </div>
                </div>

            </div>

            {showCreateModal && (
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/goals')}
                            className={`mb-4 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            ← Back to Goals
                        </button>
                        <h1 className="text-4xl font-bold mb-2">Create New Goal</h1>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Set a new goal and start tracking your progress
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'
                            }`}>
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={`rounded-lg shadow-lg p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        {/* Banner Upload */}
                        <div className="mb-6">
                            <label className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5" />
                                Goal Banner (Optional)
                            </label>

                            {bannerPreview ? (
                                <div className="relative">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveBanner}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        ✓ Image selected. It will be uploaded when you create the goal.
                                    </p>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition ${darkMode
                                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                    }`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className={`w-12 h-12 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Title */}
                        <div className="mb-6">
                            <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Goal Title *
                            </label>
                        <input
                            type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                placeholder="e.g., Run a marathon, Learn a new language"
                                required
                        />
                    </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Description *
                            </label>
                        <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="5"
                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                placeholder="Describe your goal in detail..."
                                required
                        />
                    </div>

                        {/* Category and Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Category */}
                            <div>
                                <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="personal">Personal</option>
                                    <option value="professional">Professional</option>
                                    <option value="health">Health</option>
                                    <option value="financial">Financial</option>
                                    <option value="education">Education</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                >
                                    <option value="not_started">Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                </select>
                            </div>
                        </div>

                        {/* Priority and Target Date Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Priority */}
                            <div>
                                <label className="block text-lg font-semibold mb-2">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Target Date */}
                            <div>
                                <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Target Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="target_date"
                                    value={formData.target_date}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-50 border-gray-300 text-gray-800'
                                        } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                />
                            </div>
                    </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/goals')}
                                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${darkMode
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#6634E2] text-white rounded-lg font-semibold hover:bg-[#7954d8] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Goal'}
                            </button>
                        </div>
                </form>
            </div>
            )}
        </div>
    );
};

export default CreateGoal;

