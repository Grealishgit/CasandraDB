import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Goals from './pages/Goals'
import CreateGoal from './pages/CreateGoal'
import Profile from './pages/Profile'
import LandingPage from './components/LandingPage'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Toaster />

      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes - All will have Navbar */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-goal"
          element={
            <ProtectedRoute>
              <CreateGoal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App

