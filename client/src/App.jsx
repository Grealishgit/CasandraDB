import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import LandingPage from './components/LandingPage'
import { Toaster, toast } from 'react-hot-toast';


const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      </Routes> 
    </>

  )
}

export default App