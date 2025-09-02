import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaUsers, FaBullhorn, FaHistory } from 'react-icons/fa';
import { FiMenu, FiX, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable Sidebar Content Component
const SidebarContent = ({ isCollapsed }) => {
    const linkClasses = "flex items-center gap-4 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-200";
    const activeLinkClasses = "bg-emerald-600 text-white";

    const NavItem = ({ to, icon, label, end = false }) => (
        <NavLink 
            to={to} 
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} 
            end={end}
        >
            {icon}
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span 
                        className="whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </NavLink>
    );

    return (
        <div className="flex flex-col h-full mt-10">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} h-16 mb-4`}>
                <h2 className={`text-2xl font-bold text-white transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Admin</h2>
            </div>
            <nav className="space-y-2 px-2">
                <NavItem to="/admin/dashboard" icon={<FaTachometerAlt size={20} />} label="Dashboard" end />
                <NavItem to="/admin/orders" icon={<FaBox size={20} />} label="Orders" />
                <NavItem to="/admin/products" icon={<FaBox size={20} />} label="Products" />
                <NavItem to="/admin/users" icon={<FaUsers size={20} />} label="Users" />
                <NavItem to="/admin/promotions" icon={<FaBullhorn size={20} />} label="Promotions" />
                <NavItem to="/admin/history" icon={<FaHistory size={20} />} label="Order History" />
            </nav>
        </div>
    );
};

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="relative min-h-screen md:flex bg-gray-100 ">
            {/* --- DESKTOP SIDEBAR --- */}
            <aside 
                className={`hidden md:flex flex-col bg-gray-800 text-white transition-all duration-300 ease-in-out relative ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
            >
                <SidebarContent isCollapsed={isSidebarCollapsed} />
                {/* Desktop Toggle Button */}
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                    className="absolute top-1/2 -right-4 bg-emerald-600 text-white p-2 rounded-full shadow-lg hover:bg-emerald-700 transition-all focus:outline-none"
                >
                    {isSidebarCollapsed ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
                </button>
            </aside>

            {/* --- MOBILE SIDEBAR & OVERLAY --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-30 md:hidden "
                        />
                        {/* Mobile Menu */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-40 md:hidden"
                        >
                            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-white">
                                <FiX size={24} />
                            </button>
                            <SidebarContent isCollapsed={false} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT --- */}
            <main className={`flex-1 transition-all duration-300 ease-in-out`}>
                <div className="p-4 md:p-8">
                    {/* Mobile Header with Hamburger Menu */}
                    <header className="md:hidden flex items-center justify-start mb-4 mt-8">
                        
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-800">
                            <FiMenu size={24} />
                        </button>
                    </header>
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;