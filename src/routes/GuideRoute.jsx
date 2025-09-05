import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../pages/shared/Loading/Loading';
import { Navigate } from 'react-router';

const GuideRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole()

    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'guide') {
        return <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    }

    return children;
};

export default GuideRoute;