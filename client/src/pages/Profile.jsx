import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, Settings, Award, Target, TrendingUp, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { darkMode } = useOutletContext() || { darkMode: false };
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: 'Passionate about achieving goals and continuous improvement.',
    joinedDate: user?.created_at || new Date().toISOString(),
  });

  const stats = [
    { label: 'Total Goals', value: 12, icon: Target, color: 'text-blue-500' },
    { label: 'Completed', value: 5, icon: Award, color: 'text-green-500' },
    { label: 'In Progress', value: 4, icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Success Rate', value: '41.7%', icon: TrendingUp, color: 'text-orange-500' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Implement API call to update profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      bio: 'Passionate about achieving goals and continuous improvement.',
      joinedDate: user?.created_at || new Date().toISOString(),
    });
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen pt-20 pb-10 px-4  ${darkMode ? 'bg-linear-to-tr from-gray-950 via-gray-900 to-gray-950 text-white' :
      'bg-linear-to-tl via-indigo-400/40 from-indigo-50 to-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account information and view your progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-[#6634E2] flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button className="text-sm text-[#6634E2] hover:underline">
                  Change Avatar
                </button>
              </div>

              {/* Profile Info */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#6634E2]" />
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Username</p>
                        <p className="font-semibold">{profileData.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#6634E2]" />
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                        <p className="font-semibold">{profileData.email}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#6634E2]" />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Member Since</p>
                    <p className="font-semibold">
                      {new Date(profileData.joinedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="w-full py-2 cursor-pointer bg-[#6634E2] text-white rounded-md hover:bg-[#7954d8] transition flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className={`w-full py-2 rounded-md cursor-pointer transition flex items-center justify-center gap-2 
                        ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                      className="w-full py-2 cursor-pointer bg-[#6634E2] text-white rounded-md hover:bg-[#7954d8] transition flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bio Section */}
            <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-[#6634E2]" />
                About Me
              </h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-[#6634E2]`}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {profileData.bio}
                </p>
              )}
            </div>

            {/* Settings Section */}
            <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#6634E2]" />
                Account Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Email Notifications</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive updates about your goals
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6634E2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6634E2]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Goal Reminders</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Get reminded about upcoming deadlines
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6634E2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6634E2]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Weekly Reports</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive weekly progress summaries
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#6634E2]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6634E2]"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <button className="text-red-500 hover:text-red-600 font-semibold">
                  Delete Account
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-lg shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-[#6634E2]" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="font-semibold">Completed "Morning Workout"</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="font-semibold">Started "Learn Spanish"</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Yesterday
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="flex-1">
                    <p className="font-semibold">Updated "Read 50 Books"</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;