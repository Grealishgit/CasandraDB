import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Goals from './pages/Goals'
import CreateGoal from './pages/CreateGoal'
import EditGoal from './pages/EditGoal'
import Profile from './pages/Profile'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes with Layout (Navbar) */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/:id" element={<EditGoal />} />
          <Route path="/create-goal" element={<CreateGoal />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes> 
    </AuthProvider>
  )
}

export default App

