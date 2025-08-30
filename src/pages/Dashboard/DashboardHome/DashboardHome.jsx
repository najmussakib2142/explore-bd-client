import React from 'react';
import UserDashboard from './UserDashboard';
import AdminProfile from '../AdminProfile/AdminProfile';
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../shared/Loading/Loading';
import { useQuery } from '@tanstack/react-query';

const DashboardHome = () => {
    const axiosInstance = useAxios()
    const { user } = useAuth();


    const email = user?.email


    const { data: userInfo = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["user", "email"],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users/${email}`);
            return res.data;
        },
    });

    if (loadingUsers) {
        return <Loading></Loading>
    }
    return (
        <div>
            {userInfo?.role === 'user' && (
                <UserDashboard></UserDashboard>
            )}
            {userInfo?.role === 'user' && (
                <UserDashboard></UserDashboard>
            )}

            {userInfo?.role === 'admin' && (
                <AdminProfile></AdminProfile>
            )}
        </div>
    );
};

export default DashboardHome;