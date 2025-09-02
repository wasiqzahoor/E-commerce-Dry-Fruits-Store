import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/api';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [view, setView] = useState('credentials');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  // Animation state
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger initial animation
    setAnimate(true);
  }, []);

  const handleAuthenticate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/api/users/authenticate', { email, password });

      switch (data.action) {
        case 'login_success': {
          toast.success(data.message);
          login(data.userData);
          if (data.userData.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
          break;
        }
        case 'verify_otp':
          toast.info(data.message);
          setIsNewUser(false);
          setView('verify');
          break;
        case 'register_and_verify':
          toast.info(data.message);
          setIsNewUser(true);
          setView('verify');
          break;
        case 'login_fail':
          toast.error(data.message);
          break;
        default:
          toast.error("An unexpected error occurred.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (isNewUser && !name.trim()) {
      return toast.error("Please enter your full name.");
    }

    setIsLoading(true);
    try {
      const payload = { email, otp, name: isNewUser ? name : undefined };
      const { data } = await apiClient.post('/api/users/verify', payload);

      toast.success(data.message);
      login(data.userData);

      if (data.userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/api/users/google-login', { token: googleToken });
      login(data);
      toast.success("Logged in successfully with Google!");

      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/api/users/forgot-password', { email });
      toast.info(data.message);
      setView('verifyReset');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/api/users/reset-password', { email, otp, password });
      toast.success(data.message);
      setView('credentials');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const backToLogin = () => {
    setView('credentials');
    setEmail('');
    setPassword('');
    setOtp('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Dry Fruits Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://i.ibb.co/sJW7YKcy/Generated-Image-August-28-2025-8-37-PM.jpg")' }}
      >
        <div className="absolute inset-0 bg-emerald-900/70"></div>
      </div>

      {/* Spacer for a theoretical top navbar. Adjust height as needed. */}
      <div className="h-16 w-full"></div>

      <div className={`w-full max-w-md p-6 my-auto space-y-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} z-10`}>

        {/* Logo and Branding */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20"></div>
            <img
              src="https://i.ibb.co/ksN5ztJX/Gilgit-Dry-Fruits-Logo-Design.png"
              alt="Company Logo"
              className="relative rounded-full w-16 h-16 object-contain z-10 border-4 border-white shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">Gilgit Dry Fruits</h1>
          <p className="text-gray-600 text-sm mt-1">Premium Quality, Direct from Nature</p>
        </div>

        {/* Credentials View (Email/Password) */}
        {view === 'credentials' && (
          <form onSubmit={handleAuthenticate} className="space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800">Welcome Back</h2>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <div className="text-right text-sm">
              <button type="button" onClick={() => setView('forgot')} className="font-medium text-emerald-600 hover:underline">
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-lg hover:from-emerald-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : 'Continue'}
            </button>
          </form>
        )}

        {/* Verification View (Name/OTP) */}
        {view === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800">Verify Your Account</h2>
            <p className="text-center text-gray-600 text-sm">An OTP has been sent to {email}</p>
            <div className="space-y-3">
              {isNewUser && (
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-Digit OTP"
                  required
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-center tracking-widest text-sm"
                  maxLength="4"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-lg hover:from-emerald-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify & Continue'}
            </button>
          </form>
        )}

        {/* === FORGOT PASSWORD VIEW === */}
        {view === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800">Reset Password</h2>
            <p className="text-center text-gray-600 text-sm">Enter your email and we'll send you a code to reset your password.</p>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 font-semibold bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-lg hover:from-emerald-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center text-sm">
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        )}

        {/* === VERIFY RESET OTP VIEW === */}
        {view === 'verifyReset' && (
          <form onSubmit={(e) => { e.preventDefault(); setView('setNewPassword'); }} className="space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800">Enter Code</h2>
            <p className="text-center text-gray-600 text-sm">A 6-digit code has been sent to {email}.</p>
            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-Digit OTP"
                required
                maxLength="6"
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-center tracking-widest text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <button type="submit" className="w-full py-3 font-semibold bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-lg hover:from-emerald-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center text-sm">
              Continue
            </button>
          </form>
        )}

        {/* === SET NEW PASSWORD VIEW === */}
        {view === 'setNewPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-800">Set New Password</h2>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                required
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50 text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold bg-gradient-to-r from-emerald-500 to-amber-500 text-white rounded-lg hover:from-emerald-600 hover:to-amber-600 disabled:opacity-50 transition-all duration-500 shadow-md hover:shadow-lg flex items-center justify-center text-sm"
            >
              {isLoading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Social Logins */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white/95 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google Login Failed');
            }}
            theme="filled_blue"
            size="medium"
            shape="pill"
            width="300"
            logo_alignment="left"
            className="w-full max-w-[300px] google-login-button"
          />
        </div>

        {/* Back button for all non-credential views */}
        {['verify', 'forgot', 'verifyReset', 'setNewPassword'].includes(view) && (
          <button
            onClick={backToLogin}
            className="w-full py-2 font-medium text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors duration-300 flex items-center justify-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
        )}
      </div>

      <style jsx>{`
        /* Custom styles for Google Login button responsiveness */
        .google-login-button > div {
          width: 100% !important; /* Forces the Google button container to take full width */
        }
        @media (max-width: 640px) {
          .google-login-button > div {
            transform: scale(0.9) !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;