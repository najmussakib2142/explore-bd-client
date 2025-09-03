import React from 'react';
import { FaBoxOpen, FaClipboardList, FaCompass, FaEdit, FaHome, FaMoneyCheckAlt, FaMotorcycle, FaPlusCircle, FaUserCheck, FaUserClock, FaUserShield, FaUserTie } from 'react-icons/fa';
import { NavLink, Outlet, useNavigation } from 'react-router';
import Logo from '../pages/shared/Logo/Logo';
import { FcPackage } from 'react-icons/fc';
import Footer from '../pages/shared/Footer/Footer';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/shared/Loading/Loading';

const DashBoardLayout = () => {

    const { role, roleLoading } = useUserRole();
    console.log(role, roleLoading);
    const { state } = useNavigation()

    // if (roleLoading) {
    //     return <Loading></Loading>
    // }

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
                            {state == "loading" ? <Loading></Loading> : <Outlet />}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-100 text-base-content min-h-full w-80 p-4 space-y-2">
                            {/* <ProFastLog /> */}
                            <Logo></Logo>

                            <li>
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
                                        <NavLink to="/dashboard/myBookings/" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
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
                                    <li>
                                        <NavLink
                                            to="/dashboard/manageStories"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300"
                                        >
                                            <FaEdit /> Manage Stories
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to="/dashboard/paymentHistory" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaMoneyCheckAlt /> Payment History
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/beAGuide" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300"
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
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300"
                                        >
                                            <FaClipboardList /> MyAssignedTours
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
                                    <li>
                                        <NavLink
                                            to="/dashboard/manageStories"
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300"
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
                                        <NavLink to="/dashboard/addPackage" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaBoxOpen className="text-lg" /> Add Package
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/pendingGuides" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaUserClock /> Manage Candidates
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/manage-users" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaUserClock /> Manage Users
                                        </NavLink>
                                    </li>
                                    {/* <li>
                                        <NavLink to="/dashboard/assign-guide" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaCompass /> Assign Guide
                                        </NavLink>
                                    </li> */}
                                    <li>
                                        <NavLink to="/dashboard/makeAdmin" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaUserShield /> Make Admin
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/active-guides" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-base-300">
                                            <FaUserCheck /> Active Guides
                                        </NavLink>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </div>
    );
};

export default DashBoardLayout;