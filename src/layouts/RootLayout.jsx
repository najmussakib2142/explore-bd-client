import React from 'react';
import { Outlet, useNavigation } from 'react-router';
import Navbar from '../pages/shared/Navbar/Navbar';
import Footer from '../pages/shared/Footer/Footer';

const RootLayout = () => {
    const { state } = useNavigation()

    return (
        <div className=' mt-[72px] '>
            <Navbar></Navbar>
            {state == "loading" ? <Loading></Loading> : <Outlet />}
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;