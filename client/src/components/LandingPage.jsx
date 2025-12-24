import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import bg from '../assets/images/bg.jpg';
import { Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LandingPage = () => {
    const navigate = useNavigate();
    const { register, login, forgotPassword, isAuthenticated, loading } = useAuth();

    const [isLogin, setIsLogin] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, loading, navigate]);

    // Functions
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login({ email, password });

        if (result.success) {
            setIsLogin(false);
            toast.success('Login successful! Redirecting in a few seconds...');
            navigate('/home'); // Redirect to home
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        const result = await register({ username, email, password });

        if (result.success) {
            setIsSignUp(false);
            toast.success('Account created successfully! Redirecting in a few seconds...');
            navigate('/home'); // Redirect to home
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        await forgotPassword(email);
    };

    const handlePasswordCompare = () => {
        if (password && confirmPassword && password !== confirmPassword) {
            setError("Passwords do not match");
        } else {
            setError("");
        }
    }

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl text-[#6634E2]">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-screen  bg-cover bg-center flex flex-col justify-center items-center" style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}>
                <h1 className="text-5xl md:text-6xl landing-page lg:text-7xl text-center font-bold text-white mb-6 drop-shadow-lg">
                    Welcome to FU | <span className='text-[#6634E2]'>GOALS</span>
                </h1>
                <p className="text-xl md:text-2xl landing-page lg:text-3xl text-white mb-8 drop-shadow-md">
                    Your ultimate goal tracking application
                </p>
                <div className="flex space-x-4">
                    <button onClick={() => setIsLogin(true)}
                        className="px-6 py-2 bg-[#6634E2] landing-page text-white text-lg rounded-md 
                        cursor-pointer hover:bg-[#7954d8] transition duration-300 drop-shadow-md">
                        Get Started
                    </button>
                    <a href="/home" className="px-6 py-2 bg-[#030609] landing-page text-white text-lg
                     cursor-pointer  rounded-md hover:bg-[#212124] transition duration-300 drop-shadow-md">
                        Learn More
                    </a>
                </div>


            </div>


            {/* Modals for sign up and sign In */}
            {isLogin && (
                <div className='flex flex-col absolute justify-center items-center
                 top-0 backdrop-blur-sm left-0 w-full h-full bg-black/30 bg-opacity-50'>

                    <form className='flex flex-col relative justify-center items-center max-w-xl mx-auto p-5 bg-white
                     rounded-md shadow-md'>
                        <X className='absolute top-5 right-5 text-[#6634E2] cursor-pointer text-3xl font-bold'
                            onClick={() => setIsLogin(false)} />

                        <p className='text-2xl font-bold mb-4'>FU | GOALS</p>
                        <p className='text-lg text-center mb-4'>
                            Welcome Back! Please login to your account.
                        </p>
                        <div className='mb-4 flex gap-2 flex-col w-full'>
                            <label htmlFor="">Email Address</label>
                            <input type="email"
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='border border-gray-300 p-2 rounded-md w-full'
                            />
                        </div>
                        <div className='mb-4 gap-2 flex flex-col w-full'>
                            <div className='flex justify-between mb-1'>
                                <label htmlFor="">Password</label>
                                <span className='text-sm c float-right cursor-pointer'>Forgot Password?</span>
                            </div>

                            <div className='relative w-full'>
                                <input type={showPassword ? "text" : "password"}
                                    required
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={handleForgotPassword}
                                    placeholder='Enter your password'
                                    className='border  border-gray-300 p-2 rounded-md w-full' />

                                <div className='absolute right-3 top-2 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <Eye className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <EyeOff className="w-5 h-5 text-gray-600" />
                                    )}
                                </div>
                            </div>



                        </div>

                        <button onClick={handleLogin} disabled={isLoading} className='bg-[#6634E2] text-white cursor-pointer px-4 py-2
                         rounded-md hover:bg-[#7954d8] transition duration-300 w-full
                         disabled:opacity-50 disabled:cursor-not-allowed'>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        <p className='text-sm mt-4'>
                            Don't have an account? <span className='text-[#6634E2] hover:underline font-semibold cursor-pointer' onClick={() => setIsSignUp(true)}>Sign Up</span>
                        </p>

                    </form>
                </div>
            )}

            {isSignUp && (
                <>
                    <div className='flex flex-col absolute justify-center items-center top-0 backdrop-blur-sm left-0 w-full h-full bg-black/30 bg-opacity-50'>
                        <form className='flex relative flex-col justify-center items-center max-w-md w-full mx-auto p-6 bg-white rounded-md shadow-md'>

                            <X className='absolute top-5 right-5 text-[#6634E2] cursor-pointer text-3xl font-bold'
                                onClick={() => { setIsLogin(false); setIsSignUp(false); }} />
                            <div className='flex flex-col justify-center items-center'>
                                <p className='text-2xl font-bold mb-2'>FU | GOALS</p>
                                <p className='text-lg text-center mb-4'>
                                    Create your account to get started!
                                </p>
                                {error && <p className='text-red-500'>{error}</p>}
                            </div>


                            <div className='mb-4 gap-2 flex flex-col w-full'>
                                <label htmlFor="">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={handlePasswordCompare}
                                    placeholder='Enter your username'
                                    className='border border-gray-300 p-2 rounded-md w-full'
                                />
                            </div>

                            <div className='mb-4 flex flex-col w-full'>
                                <label htmlFor="">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email'
                                    className='border border-gray-300 p-2 rounded-md w-full'
                                />
                            </div>

                            <div className='mb-4 gap-2 flex flex-col w-full'>
                                <label htmlFor="password">Password</label>

                                <div className='relative w-full'>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={handlePasswordCompare}
                                        placeholder='Enter your password'
                                        className='border border-gray-300 p-2 rounded-md w-full'
                                    />
                                    <div className='absolute right-3 top-2 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <Eye className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <EyeOff className="w-5 h-5 text-gray-600" />
                                        )}
                                    </div>

                                </div>

                            </div>

                            <div className='mb-4 gap-2 flex flex-col w-full'>
                                <label htmlFor="">Confirm Password</label>

                                <div className='relative w-full'>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onBlur={handlePasswordCompare}
                                        placeholder='Confirm your password'
                                        className='border border-gray-300 p-2 rounded-md w-full'
                                    />
                                    <div className='absolute right-3 top-2 cursor-pointer' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? (
                                            <Eye className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <EyeOff className="w-5 h-5 text-gray-600" />
                                        )}
                                    </div>
                                </div>

                            </div>

                            <button onClick={handleSignUp} disabled={isLoading} className='bg-[#6634E2] text-white cursor-pointer px-4 py-2
                             rounded-md hover:bg-[#7954d8] transition duration-300 w-full
                             disabled:opacity-50 disabled:cursor-not-allowed'>
                                {isLoading ? 'Signing up...' : 'Sign Up'}
                            </button>

                            <p className='text-sm mt-4'>
                                Already have an account?
                                <span className='text-[#6634E2] font-semibold hover:underline cursor-pointer' onClick={() => { setIsLogin(true); setIsSignUp(false); }}>Login</span>
                            </p>
                        </form>
                    </div>
                </>
            )}
        </>
    )
}

export default LandingPage