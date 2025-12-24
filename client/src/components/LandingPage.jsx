import React from 'react'
import bg from '../assets/images/bg.jpg'

const LandingPage = () => {
    return (
        <div className="w-full h-screen  bg-cover bg-center flex flex-col justify-center items-center" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }}>
            <h1 className="text-5xl md:text-6xl landing-page lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                Welcome to FU | GOALS
            </h1>
            <p className="text-xl md:text-2xl landing-page lg:text-3xl text-white mb-8 drop-shadow-md">
                Your ultimate goal tracking application
            </p>
            <div className="flex space-x-4">
                <a href="/home" className="px-6 py-2 bg-[#6634E2] landing-page text-white text-lg rounded-lg hover:bg-[#030609] transition duration-300 drop-shadow-md">
                    Get Started
                </a>
                <a href="/home" className="px-6 py-2 bg-[#030609] landing-page text-white text-lg rounded-lg hover:bg-[#6634E2] transition duration-300 drop-shadow-md">
                    Learn More
                </a>
            </div>


        </div>
    )
}

export default LandingPage