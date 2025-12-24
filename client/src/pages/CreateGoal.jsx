import React from 'react';

const CreateGoal = () => {
    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">Create New Goal</h1>

                <form className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="mb-4">
                        <label className="block text-white mb-2">Goal Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#6634E2]"
                            placeholder="Enter your goal title"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#6634E2]"
                            rows="4"
                            placeholder="Describe your goal"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-2">Category</label>
                        <select className="w-full px-4 py-2 bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:border-[#6634E2]">
                            <option value="">Select a category</option>
                            <option value="FITNESS">Fitness</option>
                            <option value="CAREER">Career</option>
                            <option value="EDUCATION">Education</option>
                            <option value="PERSONAL">Personal</option>
                            <option value="FINANCE">Finance</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-[#6634E2] text-white rounded-md hover:bg-[#7954d8] transition duration-200"
                    >
                        Create Goal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGoal;
