import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
    // baseURL: `http://localhost:5000`
    baseURL: `https://explore-bd-server-iota.vercel.app`
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate()

    // console.log(user.accessToken);

    axiosSecure.interceptors.request.use((config) => {
        // for refresh token, can't use practice project
        // if (user) {
        //     const token = await user.getIdToken(true);
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        config.headers.Authorization = `Bearer ${user.accessToken}`;

        return config;
    }, error => {
        return Promise.reject(error);
    })

    axios.interceptors.response.use(res => {
        return res;
    }, error => {
        // console.log('inside res interceptor', error.status);
        const status = error.status;
        if (status === 403) {
            navigate('/forbidden')
        }
        else if (status === 401) {
            logOut()
                .then(() => {
                    navigate('/login')
                })
                .catch(() => { })
        }

        return Promise.reject(error)
    })

    return axiosSecure;
};

export default useAxiosSecure;