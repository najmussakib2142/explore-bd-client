import React from 'react';
import { Outlet } from 'react-router';
import lottie from '../assets/Email.json'
import Lottie from 'lottie-react';
import Logo from '../pages/shared/Logo/Logo';

const AuthLayout = () => {
    return (
        <div className="md:p-12 max-w-7xl mx-auto">
            <div className='md:py-4 py-4 px-7 lg:pl-15'>
                <Logo></Logo>
            </div>
            <div className="hero-content flex-col flex-1 lg:flex-row-reverse">
                {/* <img
                    src={lottie}
                    className="max-w-sm rounded-lg shadow-2xl"
                /> */}
                <div className="text-center lg:text-left">
                    <Lottie className="w-full min-w-[300px] max-w-[550px] mx-auto" animationData={lottie} loop={true} ></Lottie>
                </div>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;