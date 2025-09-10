import React from 'react';
import UserDashboard from './UserDashboard';
import AdminProfile from '../AdminProfile/AdminProfile';
// import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../shared/Loading/Loading';
import { useQuery } from '@tanstack/react-query';
import GuideDashboard from '../GuideDashboard/GuideDashboard';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';

const DashboardHome = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth();


    const email = user?.email


    const { data: userInfo = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["user", "email"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${email}`);
            return res.data;
        },
    });

    if (loadingUsers) {
        return <Loading></Loading>
    }
    return (
        <div>
            <Helmet>
                <title>Dashboard | ExploreBD</title>
                <meta
                    name="description"
                    content="Admin Dashboard for ExploreBD – manage packages, bookings, and guides."
                />
            </Helmet>
            {userInfo?.role === 'user' && (
                <UserDashboard></UserDashboard>
            )}
            {userInfo?.role === 'guide' && (
                // <UserDashboard></UserDashboard>
                <GuideDashboard></GuideDashboard>
            )}

            {userInfo?.role === 'admin' && (
                <AdminProfile></AdminProfile>
            )}
        </div>
    );
};

export default DashboardHome;