import React from 'react';
import { FaBoxOpen, FaClipboardList, FaCompass, FaEdit, FaHome, FaMoneyCheckAlt, FaMotorcycle, FaPlusCircle, FaUserCheck, FaUserClock, FaUserShield, FaUserTie } from 'react-icons/fa';
import { NavLink, Outlet, useNavigation } from 'react-router';
import Logo from '../pages/shared/Logo/Logo';
import { FcPackage } from 'react-icons/fc';
import Footer from '../pages/shared/Footer/Footer';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/shared/Loading/Loading';
import { useTheme } from '../provider/ThemeContext';

const DashBoardLayout = () => {

    const { role, roleLoading } = useUserRole();
    // console.log(role, roleLoading);
    const { state } = useNavigation()
        const { theme, toggleTheme } = useTheme();
    

    // if (roleLoading) {
    //     return <Loading></Loading>
    // }

    return (
        
        <div>
            
            <div className=" flex ">
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content  flex flex-col p-4">
                        {/* Navbar for mobile */}
                        <div className="navbar md:px-10 fixed z-[999] top-1 rounded-md left-0 bg-slate-200 dark:bg-slate-900 text-base-content shadow-md lg:hidden w-full  mb-4">
                            <div className="flex-none">
                                <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24"
                                        className="inline-block h-6 w-6 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </label>
                            </div>
                            <div className="mx-2 flex-1 px-2 font-semibold text-lg">Dashboard</div>
                        </div>

                        {/* Page Content */}
                        <div className="p-2 mt-20 md:mt-15 lg:mt-0  rounded-xl ">
                            {state == "loading" ? <Loading></Loading> : <Outlet />}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay "></label>
                        <ul className="menu pt-22 md:pt-20  pr-5 md:pr-0 lg:pt-5 bg-slate-200/80 dark:bg-slate-900/90 md:bg-slate-200 md:dark:bg-slate-900  lg:bg-white/80 lg:dark:bg-slate-800/15 backdrop-blur-sm shadow-md transition-transform duration-300 text-base-content min-h-full w-80 p-4 space-y-2">
                            {/* <ProFastLog /> */}
                           <div className='border-b pb-3'>
                             <Logo></Logo>
                           </div>

                            <li className='pt-1'>
                                <NavLink to="/dashboard"
                                    end
                                    className={({ isActive }) =>
                                        location.pathname === "/dashboard" || isActive ? "active" : ""
                                    }                                >
                                    <FaHome /> Home
                                </NavLink>
                            </li>

                            {!roleLoading && role === 'user' &&
                                <>
                                    <li>
                                        <NavLink to="/dashboard/myBookings/" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaClipboardList /> My Bookings
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/addStory"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800"
                                        >
                                            <FaPlusCircle /> Add Story
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/manageStories"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800"
                                        >
                                            <FaEdit /> Manage Stories
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to="/dashboard/paymentHistory" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaMoneyCheckAlt /> Payment History
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/beAGuide" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800"
                                        >
                                            <FaUserTie /> Be a Guide
                                        </NavLink>

                                    </li>
                                </>
                            }


                            {/* {guide} */}
                            {!roleLoading && role === 'guide' &&
                                <>
                                    <li>
                                        <NavLink
                                            to="/dashboard/myAssignedTours"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800"
                                        >
                                            <FaClipboardList /> MyAssignedTours
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/addStory"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800"
                                        >
                                            <FaPlusCircle /> Add Story
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/manageStories"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800"
                                        >
                                            <FaEdit /> Manage Stories
                                        </NavLink>
                                    </li>
                                </>
                            }

                            {/* Admin */}
                            {!roleLoading && role === 'admin' &&
                                <>
                                    <li>
                                        <NavLink to="/dashboard/addPackage" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaBoxOpen className="text-lg" /> Add Package
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/pendingGuides" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaUserClock /> Manage Candidates
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/manage-users" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaUserClock /> Manage Users
                                        </NavLink>
                                    </li>
                                    {/* <li>
                                        <NavLink to="/dashboard/assign-guide" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaCompass /> Assign Guide
                                        </NavLink>
                                    </li> */}
                                    <li>
                                        <NavLink to="/dashboard/makeAdmin" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaUserShield /> Make Admin
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/active-guides" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-200  dark:hover:bg-gray-800">
                                            <FaUserCheck /> Active Guides
                                        </NavLink>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>

            </div>
            <button
                onClick={toggleTheme}
                className="fixed cursor-pointer bottom-4 right-4 z-50 p-3 rounded-full bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 shadow-xl transition-colors font-semibold text-sm"
                aria-label="Toggle theme"
            >
                {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
            <Footer></Footer>
        </div>
    );
};

export default DashBoardLayout;