import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '../Logo/Logo';
import { useTheme } from '../../../provider/ThemeContext';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaUserCircle, FaTimes, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logOut } = useAuth();
    const [showNavbar, setShowNavbar] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Drawer State

    const handleSignOut = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1471e3",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log me out!"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        localStorage.removeItem("access-token");
                        Swal.fire({
                            title: "Logged out!",
                            text: "You have been successfully logged out.",
                            icon: "success",
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                        });
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    });
            }
        });
    };

    const navItems = (
        <>
            <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary hover:text-primary transition-colors'>
                <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
            </li>
            <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary hover:text-primary transition-colors'>
                <NavLink to="/communityPage" onClick={() => setIsOpen(false)}>Community</NavLink>
            </li>
            <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary hover:text-primary transition-colors'>
                <NavLink to="/about" onClick={() => setIsOpen(false)}>About Us</NavLink>
            </li>
            <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary hover:text-primary transition-colors'>
                <NavLink to="/allTrips" onClick={() => setIsOpen(false)}>Trips</NavLink>
            </li>
        </>
    );

    useEffect(() => {
        if (isOpen) {
            // Prevent scrolling
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scrolling
            document.body.style.overflow = 'unset';
        }

        // Cleanup function to ensure scroll is restored if component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div>
            {/* Main Navbar */}
            <div className={`fixed top-0 left-0 w-full z-[999] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm shadow-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="navbar max-w-7xl mx-auto h-16 px-4 md:px-8 flex justify-between items-center">

                    <div className="navbar-start flex items-center gap-2">
                        {/* Drawer Toggle Button (Mobile/Tablet) */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="btn btn-ghost lg:hidden p-2 text-gray-700 dark:text-gray-200"
                        >
                            <FaBars className="h-6 w-6" />
                        </button>

                        <div className="relative z-10">
                            <Logo />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-6 font-medium">
                            {navItems}
                        </ul>
                    </div>

                    <div className="navbar-end flex items-center gap-3">
                        {user && (
                            <div className="dropdown dropdown-end group relative">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    {user?.photoURL ? (
                                        <img className="w-10 h-10 rounded-full object-cover border border-primary" src={user.photoURL} alt="User" />
                                    ) : (
                                        <FaUserCircle className="w-10 h-10 text-gray-600 dark:text-primary" />
                                    )}
                                </div>
                                {/* Tooltip */}
                                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {user?.displayName || user?.email}
                                </div>
                                <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-52 border dark:border-gray-700">
                                    <li className=" py-2 border-b dark:border-gray-700">
                                        {/* <span className="font-bold text-xs uppercase text-gray-400">Profile</span> */}
                                        <span className="text-sm truncate font-semibold dark:text-white">{user?.displayName || "User"}</span>
                                    </li>
                                    <li><NavLink to="/dashboard/" className="dark:text-gray-200">Dashboard</NavLink></li>
                                    <li><NavLink to="/offers" className="dark:text-gray-200">Offers</NavLink></li>
                                </ul>
                            </div>
                        )}

                        {user ? (
                            <button onClick={handleSignOut} className="btn btn-sm md:btn-md border border-primary text-primary bg-transparent hover:bg-primary hover:text-white">
                                Sign Out
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-sm md:btn-md bg-primary text-white border border-primary hover:bg-transparent hover:text-primary">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Framer Motion Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] lg:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-[#0f172a] z-[1001] shadow-2xl lg:hidden p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <Logo />
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <ul className="flex flex-col gap-6 text-lg font-medium">
                                {navItems}
                            </ul>

                            <div className="mt-auto pt-6 border-t dark:border-gray-800">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Account Settings</p>
                                {user && (
                                    <div className="flex flex-col gap-3">
                                        <NavLink to="/dashboard/" onClick={() => setIsOpen(false)} className="text-gray-700 dark:text-gray-200">Dashboard</NavLink>
                                        <NavLink to="/offers" onClick={() => setIsOpen(false)} className="text-gray-700 dark:text-gray-200">Offers</NavLink>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="fixed cursor-pointer bottom-4 right-4 z-[999] p-3 rounded-full bg-gray-800/80 text-white dark:bg-gray-100/90 dark:text-gray-900 shadow-2xl transition-all hover:scale-110 active:scale-95 font-semibold text-sm"
                aria-label="Toggle theme"
            >
                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>
        </div>
    );
};

export default Navbar;