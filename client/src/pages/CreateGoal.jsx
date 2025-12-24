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

                        <div className="md:hidden mt-4 flex items-center justify-center top-1/2z-10">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex px-8 text-white text-nowrap py-2 rounded-md  gap-2 bg-[#6634E2] hover:bg-[#7954d8] items-center   cursor-pointer transition-transform hover:scale-110">

                                <CirclePlus className="w-5 h-5 text-white" strokeWidth={2.5} />
                                Create Goal

                            </button>
                        </div>
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
                <div className="fixed inset-0 bg-black/50 z-50 mt-15 backdrop-blur-sm flex items-center justify-center
                 p-4 overflow-y-auto">
                    <div className={`w-full max-w-7xl rounded-md shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        {/* Header */}
                        <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-end">

                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className={`p-2 flex items-center gap-1 cursor-pointer rounded-md transition ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                                >
                                    <X className="w-5 h-5" /> Close
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className={`mx-6 mt-2 p-4 rounded-md flex items-center gap-2 ${darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                                <AlertCircle className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
                            {/* Left Section - Input Form */}
                            <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-4 pl-2">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Banner Upload */}
                                    <div>
                                        <label className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" />
                                            Goal Banner (Optional)
                                        </label>

                                        {bannerPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Banner preview"
                                                    className="w-full h-50 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveBanner}
                                                    className="absolute cursor-pointer top-2 right-2 p-2 bg-red-500
                                                     text-white rounded-full hover:bg-red-600 transition"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${darkMode ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                                                    }`}>
                                                    <Upload className={`w-10 h-10 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Click to upload image
                                                    </p>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                                            </label>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            Goal Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                                                } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                            placeholder="e.g., Run a marathon"
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-lg font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Description *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className={`w-full px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                                                } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                            placeholder="Describe your goal..."
                                            required
                                        />
                                    </div>


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Category */}
                                        <div>
                                            <label className="text-lg font-semibold  flex items-center gap-2">
                                                <Tag className="w-5 h-5" />
                                                Category *
                                            </label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className={`w-full cursor-pointer px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
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
                                            <label className="text-lg font-semibold mb-2">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 cursor-pointer  py-2 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                            >
                                                <option value="not_started">Not Started</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="on_hold">On Hold</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Priority */}
                                        <div>
                                            <label className="text-lg font-semibold mb-2">Priority</label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                className={`w-full cursor-pointer  px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>

                                        {/* Target Date */}
                                        <div>
                                            <label className="text-lg font-semibold  flex items-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                Target Date
                                            </label>
                                            <input
                                                type="date"
                                                name="target_date"
                                                value={formData.target_date}
                                                onChange={handleInputChange}
                                                className={`w-full cursor-pointer  px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'
                                                    } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                            />
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                }`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 bg-[#6634E2] text-white rounded-lg font-semibold hover:bg-[#7954d8] transition disabled:opacity-50"
                                        >
                                            {loading ? 'Creating...' : 'Create Goal'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Right Section - Live Preview */}
                            <div className={`sticky top-0 h-fit rounded-md p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#6634E2]" />
                                    Preview
                                </h2>

                                <div className={`rounded-md overflow-hidden shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                                    {/* Preview Banner */}
                                    {bannerPreview ? (
                                        <img src={bannerPreview} alt="Preview" className="w-full h-48 object-cover" />
                                    ) : (
                                        <div className={`w-full h-48 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                            <ImageIcon className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                        </div>
                                    )}

                                    <div className="p-5 space-y-4">
                                        {/* Preview Title */}
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">
                                                {formData.title || 'Goal Title'}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {formData.category && (
                                                    <span className="px-3 py-1 bg-[#6634E2] text-white text-xs rounded-full capitalize">
                                                        {formData.category}
                                                    </span>
                                                )}
                                                {formData.status && (
                                                    <span className={`px-3 py-1 text-xs rounded-full ${formData.status === 'completed' ? 'bg-green-500 text-white' :
                                                        formData.status === 'in_progress' ? 'bg-blue-500 text-white' :
                                                            formData.status === 'on_hold' ? 'bg-yellow-500 text-white' :
                                                                'bg-gray-500 text-white'
                                                        }`}>
                                                        {formData.status.replace('_', ' ')}
                                                    </span>
                                                )}
                                                {formData.priority && (
                                                    <span className={`px-3 py-1 text-xs rounded-full ${formData.priority === 'high' ? 'bg-red-500 text-white' :
                                                        formData.priority === 'medium' ? 'bg-orange-500 text-white' :
                                                            'bg-gray-500 text-white'
                                                        }`}>
                                                        {formData.priority} priority
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Preview Description */}
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {formData.description || 'Goal description will appear here...'}
                                            </p>
                                        </div>

                                        {/* Preview Target Date */}
                                        {formData.target_date && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-[#6634E2]" />
                                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                                    Target: {new Date(formData.target_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGoal;

