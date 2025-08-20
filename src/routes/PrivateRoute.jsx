import React from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../pages/shared/Loading/Loading';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return <Loading></Loading>
    }

    if (!user) {
        <Navigate to="/login"></Navigate>
    }
    return children;
};

export default PrivateRoute;