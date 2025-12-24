import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { goalsAPI } from '../api/goals';
import { Upload, X, Image as ImageIcon, Calendar, Target, FileText, Tag, AlertCircle, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditGoal = () => {
    const { id } = useParams();
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
    const [fetchingGoal, setFetchingGoal] = useState(true);
    const [error, setError] = useState(null);

    // Fetch goal data on mount
    useEffect(() => {
        fetchGoal();
    }, [id]);

    const fetchGoal = async () => {
        try {
            setFetchingGoal(true);
            const response = await goalsAPI.getGoal(id);

            if (response.success) {
                const goal = response.data;
                setFormData({
                    title: goal.title || '',
                    description: goal.description || '',
                    category: goal.category || '',
                    status: goal.status?.toLowerCase() || 'not_started',
                    priority: goal.priority?.toLowerCase() || 'medium',
                    target_date: goal.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : '',
                    banner: goal.banner || '',
                });

                // Set banner preview if exists
                if (goal.banner) {
                    setBannerPreview(goal.banner);
                }
            } else {
                toast.error('Failed to fetch goal');
                navigate('/goals');
            }
        } catch (err) {
            console.error('Error fetching goal:', err);
            toast.error('Failed to load goal');
            navigate('/goals');
        } finally {
            setFetchingGoal(false);
        }
    };

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

            // Upload new banner if selected
            let bannerUrl = formData.banner; // Keep existing banner by default
            if (bannerFile) {
                const uploadResponse = await goalsAPI.uploadBanner(bannerFile);
                if (uploadResponse.success && (uploadResponse.data.url || uploadResponse.data.cdnUrl)) {
                    bannerUrl = uploadResponse.data.url || uploadResponse.data.cdnUrl;
                }
            }

            // Update goal
            const goalData = {
                ...formData,
                banner: bannerUrl,
            };

            const response = await goalsAPI.updateGoal(id, goalData);

            if (response.success) {
                toast.success('Goal updated successfully!');
                navigate('/goals');
            } else {
                setError('Failed to update goal');
            }
        } catch (err) {
            console.error('Error updating goal:', err);
            setError(err.response?.data?.message || 'Failed to update goal. Please try again.');
            toast.error('Failed to update goal');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingGoal) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50'}`}>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#6634E2]" />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading goal...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 pb-10 px-4 ${darkMode ? 'bg-linear-to-tr from-gray-950 via-gray-900 to-gray-950 text-white' :
            'bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50'}`}>

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Edit <span className="text-[#6634E2]">Goal</span>
                    </h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Update your goal details to keep track of your progress
                    </p>
                </div>

                {/* Form Container */}
                <div className={`rounded-lg shadow-xl p-6 md:p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Form Inputs */}
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className={`flex text-sm font-medium mb-2 items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <Target className="w-4 h-4" />
                                        Goal Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Learn React.js"
                                        className={`w-full px-4 py-2 rounded-md border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className={`flex text-sm font-medium mb-2 items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <FileText className="w-4 h-4" />
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe your goal in detail..."
                                        rows={4}
                                        className={`w-full px-4 py-2 rounded-md border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            } focus:outline-none focus:ring-2 focus:ring-[#6634E2] resize-none`}
                                        required
                                    />
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Category */}
                                    <div>
                                        <label className={`flex text-sm font-medium mb-2 items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <Tag className="w-4 h-4" />
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-md border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            <option value="PERSONAL">Personal</option>
                                            <option value="PROFESSIONAL">Professional</option>
                                            <option value="HEALTH">Health</option>
                                            <option value="FINANCIAL">Financial</option>
                                            <option value="EDUCATION">Education</option>
                                            <option value="SOCIAL">Social</option>
                                            <option value="CREATIVE">Creative</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-md border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                        >
                                            <option value="not_started">Not Started</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="on_hold">On Hold</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Priority */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-md border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>

                                    {/* Target Date */}
                                    <div>
                                        <label className={`flex text-sm font-medium mb-2 items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <Calendar className="w-4 h-4" />
                                            Target Date
                                        </label>
                                        <input
                                            type="date"
                                            name="target_date"
                                            value={formData.target_date}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 rounded-md border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                                        />
                                    </div>
                                </div>

                                {/* Banner Upload */}
                                <div>
                                    <label className={`flex text-sm font-medium mb-2 items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <ImageIcon className="w-4 h-4" />
                                        Goal Banner
                                    </label>

                                    {!bannerPreview ? (
                                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition ${darkMode
                                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                                            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                                            }`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className={`w-8 h-8 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    PNG, JPG or JPEG (MAX. 5MB)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                            />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={bannerPreview}
                                                alt="Banner preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveBanner}
                                                className="absolute top-2 cursor-pointer right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Preview */}
                            <div className="space-y-6">
                                <div className={`rounded-lg p-6 border-2 border-dashed ${darkMode ? 'border-gray-600 bg-gray-700/30' : 'border-gray-300 bg-gray-50'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-[#6634E2]" />
                                        Preview
                                    </h3>

                                    {/* Banner Preview */}
                                    {bannerPreview && (
                                        <div className="mb-4 rounded-lg overflow-hidden">
                                            <img
                                                src={bannerPreview}
                                                alt="Goal banner"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h4 className="text-2xl font-bold mb-3 break-words">
                                        {formData.title || 'Your Goal Title'}
                                    </h4>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {formData.category && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${formData.category === 'PERSONAL' ? 'bg-blue-500/20 text-blue-400' :
                                                    formData.category === 'PROFESSIONAL' ? 'bg-purple-500/20 text-purple-400' :
                                                        formData.category === 'HEALTH' ? 'bg-green-500/20 text-green-400' :
                                                            formData.category === 'FINANCIAL' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                formData.category === 'EDUCATION' ? 'bg-indigo-500/20 text-indigo-400' :
                                                                    formData.category === 'SOCIAL' ? 'bg-pink-500/20 text-pink-400' :
                                                                        formData.category === 'CREATIVE' ? 'bg-orange-500/20 text-orange-400' :
                                                                            'bg-gray-500/20 text-gray-400'}`}>
                                                {formData.category}
                                            </span>
                                        )}
                                        {formData.status && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${formData.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    formData.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                                        formData.status === 'on_hold' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            formData.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-gray-500/20 text-gray-400'}`}>
                                                {formData.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        )}
                                        {formData.priority && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${formData.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                                    formData.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-green-500/20 text-green-400'}`}>
                                                {formData.priority.toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className={`mb-4 whitespace-pre-wrap break-words ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {formData.description || 'Your goal description will appear here...'}
                                    </p>

                                    {/* Target Date */}
                                    {formData.target_date && (
                                        <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">
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

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-end pt-6 border-t border-gray-600">
                            <button
                                type="button"
                                onClick={() => navigate('/goals')}
                                disabled={loading}
                                className={`px-6 py-2 rounded-md cursor-pointer font-medium transition ${darkMode
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-[#6634E2] text-white rounded-md cursor-pointer font-medium hover:bg-[#7954d8] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Update Goal
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditGoal;
