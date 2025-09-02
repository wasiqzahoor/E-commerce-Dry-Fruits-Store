import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Icons (Inmein koi tabdeeli nahi hai)
const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);


const Navbar = () => {
    const { cartItems } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.qty, 0);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    // Dropdown ke bahar click karne par usko band karne wala effect
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full bg-stone-50 text-slate-800 shadow-md z-50 transition-all duration-300">
            {/* === TABDEELI #2: 'container mx-auto' ko hata kar padding di gayi hai taake content edges ke qareeb rahe === */}
            {/* Ab yeh poori width lega aur andar se padding di jayegi */}
            <div className="w-full flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
                
                {/* Left Side: Logo aur Website ka Naam */}
                <Link to="/" className="flex items-center gap-3">
                    <img src="https://i.ibb.co/ksN5ztJX/Gilgit-Dry-Fruits-Logo-Design.png" alt="Logo" className='rounded w-10 h-10 sm:w-12 sm:h-12'/>
                    
                    {/* === TABDEELI #1: 'hidden' class hata di gayi hai taake naam mobile par bhi nazar aaye === */}
                    {/* Font size ko responsive banaya gaya hai (chota mobile par, bada desktop par) */}
                    <span className="text-base sm:text-lg md:text-xl font-bold">Gilgit Dry Fruits</span>
                </Link>

                {/* Right Side: Icons aur User Profile */}
                <div className="flex items-center gap-3 md:gap-5">
                    
                    {/* Cart Icon */}
                    {(user === null || (user && user.role === 'user')) && (
                        <Link to="/cart" className="relative hover:scale-110 transition-transform">
                            <CartIcon />
                            {totalItemsInCart > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{totalItemsInCart}</span>
                            )}
                        </Link>
                    )}

                    {/* Login Button ya User Profile Dropdown */}
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                className="flex items-center gap-1 sm:gap-2 cursor-pointer"
                            >
                                <UserIcon />
                                {/* User ka naam mobile par chupa hua hai jagah bachane ke liye */}
                                <span className="font-semibold text-sm sm:text-base hidden sm:block">{user.name}</span>
                            </button>
                            
                            {/* Dropdown Menu (animation ke saath) */}
                            <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 transition-all duration-300 ease-in-out transform ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                {user.role === 'admin' ? (
                                    <>
                                        <Link to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                                        <Link to="/my-orders" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                                        <Link to="/saved-items" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved Items ❤️</Link>
                                    </>
                                )}
                                <hr className="my-1" />
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/auth" className="bg-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md hover:bg-emerald-600 transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;