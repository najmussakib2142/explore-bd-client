import React from 'react';
import { FaBoxOpen, FaClipboardList, FaHome, FaPlusCircle, FaUserCheck, FaUserClock } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router';
import Logo from '../pages/shared/Logo/Logo';
import { FcPackage } from 'react-icons/fc';
import Footer from '../pages/shared/Footer/Footer';

const DashBoardLayout = () => {
    return (
        <div>
            <div className=" flex ">
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex flex-col p-4">
                        {/* Navbar for mobile */}
                        <div className="navbar bg-base-100 shadow-md lg:hidden w-full rounded-xl mb-4">
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
                        <div className="p-4  rounded-xl ">
                            <Outlet />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 space-y-2">
                            {/* <ProFastLog /> */}
                            <Logo></Logo>

                            <li>
                                <NavLink to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                    <FaHome /> Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/addPackage" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                    <FaBoxOpen className="text-lg" /> Add Package
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/active-guides" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                    <FaUserCheck /> Active Guides
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/pendingGuides" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                    <FaUserClock /> Pending Guides
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/myBookings" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                    <FaClipboardList /> My Bookings
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/addStory"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300"
                                >
                                    <FaPlusCircle /> Add Story
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
};

export default DashBoardLayout;