import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '../Logo/Logo';
import { useTheme } from '../../../provider/ThemeContext';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaMoon, FaSun, FaTachometerAlt, FaUserCircle } from "react-icons/fa";
import Loading from '../Loading/Loading';



const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logOut } = useAuth()
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling Down
                setShowNavbar(false);
            } else {
                // Scrolling Up
                setShowNavbar(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // if (loading) {
    //     return <Loading></Loading>
    // }

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
                        // console.log(localStorage.getItem("access-token"));
                        Swal.fire({
                            title: "Logged out!",
                            text: "You have been successfully logged out.",
                            icon: "success"
                        });
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    })
            }
        })
    }

    const navItems = <>
        <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary dark:hover:font-semibold hover:text-primary'><NavLink to="/">Home</NavLink></li>
        <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary dark:hover:font-semibold hover:text-primary' ><NavLink to="/communityPage">Community</NavLink></li>
        <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary dark:hover:font-semibold hover:text-primary' ><NavLink to="/about">About Us</NavLink></li>
        <li className='text-gray-800 dark:text-gray-200 dark:hover:text-primary dark:hover:font-semibold hover:text-primary' ><NavLink to="/allTrips">Trips</NavLink></li>
    </>
    return (
        <div>
            {/* <div className={`fixed dark:bg-[#0f172a] max-w-7xl mx-auto  top-0 w-full bg-white z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} shadow`}>
                <div className="navbar   py-0  z-50 md:pr-7 bg-base-100/80 dark:bg-[#0f172a]  backdrop-blur transition-all duration-300 shadow-md"> */}
            <div className={`fixed top-0  w-full z-50 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="navbar h-14 max-w-7xl mx-auto px-4 md:px-7 flex justify-between items-center 
                  bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-md transition-all duration-300">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden -mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /> </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm left-0 text-[#101828] dropdown-content bg-base-100  z-1 w-[40vw] p-2 shadow">
                                {navItems}
                            </ul>
                        </div>
                        <div >
                            <Logo></Logo>
                        </div>

                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu text-[#101828] menu-horizontal px-1">
                            {navItems}
                        </ul>
                    </div>

                    <div className="navbar-end md:gap-3 gap-2">
                        <div>
                            {/* <div className='hidden md:block'>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <div className="flex items-center bg-gray-300 dark:bg-gray-700 rounded-full md:p-0.5 transition-colors">
                                        <button
                                            onClick={() => toggleTheme('light')}
                                            className={`md:p-1 rounded-full transition-colors ${theme === 'light'
                                                ? 'bg-white text-yellow-600'
                                                : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            aria-label="Switch to light mode"
                                        >
                                            <span className="text-base md:text-xl">☀️</span>
                                        </button>
                                        <button
                                            onClick={() => toggleTheme('dark')}
                                            className={` md:p-1 rounded-full transition-colors ${theme === 'dark'
                                                ? 'bg-white text-indigo-500'
                                                : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            aria-label="Switch to dark mode"
                                        >
                                            <span className="text-base md:text-xl">🌙</span>
                                        </button>
                                    </div>
                                </div>
                            </div> */}

                            <div className="hidden md:block">
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <div className="flex items-center bg-gray-300 dark:bg-gray-700 rounded-full md:p-0.5 transition-colors">
                                        <button
                                            onClick={() => toggleTheme('light')}
                                            className={`md:p-1 rounded-full transition-colors ${theme === 'light'
                                                ? 'bg-base-100 text-yellow-600'
                                                : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            aria-label="Switch to light mode"
                                        >
                                            <span className="text-base md:text-xl">☀️</span>
                                        </button>

                                        <button
                                            onClick={() => toggleTheme('dark')}
                                            className={`md:p-1 rounded-full transition-colors ${theme === 'dark'
                                                ? 'bg-indigo-100 text-indigo-500'
                                                : 'text-gray-600 dark:text-gray-300'
                                                }`}
                                            aria-label="Switch to dark mode"
                                        >
                                            <span className="text-base md:text-xl">🌙</span>
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="block md:hidden">
                                <button
                                    onClick={toggleTheme}
                                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                                    className="p-2 rounded-full border border-gray-300 dark:border-gray-600  bg-white dark:bg-gray-800  hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
                                >
                                    {theme === "dark" ? (
                                        <FaSun className="text-yellow-500 text-lg" />
                                    ) : (
                                        <FaMoon className="text-gray-800 dark:text-gray-200 text-lg" />
                                    )}
                                </button>
                            </div>

                        </div>

                        {
                            user && (
                                <div className="dropdown dropdown-end group relative">
                                    {/* Dropdown button */}
                                    {/* <div tabIndex={0} role="button" className="btn btn-ghost  btn-circle avatar">
                                        <img
                                            className="w-12 dark:border dark:border-primary  h-12 rounded-full object-cover"
                                            // src={`${user ? user.photoURL : "https://i.ibb.co/VWqpdVpB/user.pngs"}`}
                                            src={user?.photoURL || "https://i.ibb.co/VWqpdVpB/user.png"}
                                            alt="User"
                                        />
                                    </div> */}
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        {user?.photoURL ? (
                                            <img
                                                className="w-12 h-12 rounded-full object-cover dark:border dark:border-primary"
                                                src={user.photoURL}
                                                alt="User"
                                            />
                                        ) : (
                                            <FaUserCircle className="w-12 h-12 text-gray-600 dark:text-primary transition-colors" />)}
                                    </div>

                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-[-36px] left-1/2 -translate-x-1/2 w-max bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg z-20">
                                        {user?.displayName || user?.email}
                                    </div>

                                    {/* Dropdown menu */}
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 dark:bg-gray-800 rounded-box w-60"
                                    >
                                        {/* Profile info (not clickable) */}
                                        <li className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 cursor-default">
                                            <div className="flex flex-col">
                                                <span className="font-semibold truncate text-gray-800 dark:text-gray-200">
                                                    {user?.displayName || "User"}
                                                </span>
                                                <span className="text-sm truncate text-gray-500 dark:text-gray-400">
                                                    {user?.email}
                                                </span>
                                            </div>
                                        </li>

                                        {/* Navigation links */}
                                        <li className="text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary">

                                            <NavLink to="/dashboard/"> Dashboard</NavLink>
                                        </li>
                                        <li className="text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary">
                                            <NavLink to="/offers">Offer Announcements</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            )
                        }


                        {
                            user ? (
                                <button
                                    onClick={handleSignOut}
                                    className="btn border border-primary text-primary bg-transparent hover:bg-primary hover:text-white"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn bg-primary text-white border border-primary hover:bg-transparent hover:text-primary"
                                >
                                    Sign In
                                </Link>
                            )
                        }


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;