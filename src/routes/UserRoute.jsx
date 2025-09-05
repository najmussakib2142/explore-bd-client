import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/shared/Loading/Loading';
import { Navigate } from 'react-router';

const UserRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole()

    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'user') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default UserRoute;