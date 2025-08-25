// import axios from 'axios';
// import React from 'react';
// import useAuth from './useAuth';
// import { useNavigate } from 'react-router';

// const axiosSecure = axios.create({
//     baseURL: `http://localhost:5000`
// })

// const useAxiosSecure = () => {
//     const { user,logOut  } = useAuth();
//     const navigate = useNavigate()

//     axiosSecure.interceptors.request.use(config => {
//         config.headers.Authorization = `Bearer ${user.accessToken}`
//         return config;
//     }, error => {
//         return Promise.reject(error);
//     })

//     axiosSecure.interceptors.response.use(res => {
//         return res;
//     }, error => {
//         console.log('inside res interceptor', error.status);
//         const status = error.status;
//         if (status === 403) {
//             navigate('/forbidden')
//         }
//         else if (status === 401) {
//             logOut()
//                 .then(() => {
//                     navigate('/login')
//                 })
//                 .catch(() => { })
//         }

//         return Promise.reject(error)
//     })

//     return axiosSecure;
// };

// export default useAxiosSecure;


import axios from "axios";
import React from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
    baseURL: `http://localhost:5000`,
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    // request interceptor
    axiosSecure.interceptors.request.use(
        async (config) => {
            if (user) {
                // get a fresh ID token every time
                const token = await user.getIdToken(true);
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // response interceptor
    axiosSecure.interceptors.response.use(
        (res) => {
            return res;
        },
        (error) => {
            console.log("inside res interceptor", error?.response?.status);
            const status = error?.response?.status;

            if (status === 403) {
                navigate("/forbidden");
            } else if (status === 401) {
                logOut()
                    .then(() => {
                        navigate("/login");
                    })
                    .catch(() => { });
            }

            return Promise.reject(error);
        }
    );

    return axiosSecure;
};

export default useAxiosSecure;
