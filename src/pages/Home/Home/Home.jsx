import React, { useEffect, useState } from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismSection from '../TourismSection/TourismSection';
import TouristStorySection from '../TouristStorySection/TouristStorySection';
import Testimonials from '../Testimonials/Testimonials';
import MostBookedPackages from '../MostBookedPackages/MostBookedPackages';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const [showBanner, setShowBanner] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Logged-in user banner
            const hasSeenBanner = localStorage.getItem(`bannerSeen_${user.email}`);
            if (!hasSeenBanner) {
                setShowBanner(true);
            }
        } else {
            // Guest banner
            const hasSeenGuestBanner = localStorage.getItem("bannerSeenGuest");
            if (!hasSeenGuestBanner) {
                setShowBanner(true);
            }
        }
    }, [user]);

    const handleCloseBanner = () => {
        if (user) {
            localStorage.setItem(`bannerSeen_${user.email}`, 'true');
        } else {
            localStorage.setItem("bannerSeenGuest", "true");
        }
        setShowBanner(false);
    };


    return (
        <div className='max-w-screen-xl mx-auto'>
            <Helmet>
                <title>ExploreBD | Discover Bangladesh</title>
                <meta
                    name="description"
                    content="ExploreBD helps you discover the Sundarbans, Cox’s Bazar, and more travel destinations in Bangladesh."
                />
                <meta property="og:title" content="ExploreBD | Discover Bangladesh" />
                <meta
                    property="og:description"
                    content="Plan your trips and adventures with ExploreBD."
                />
                <meta property="og:image" content="https://i.ibb.co/example.jpg" />
            </Helmet>
            {showBanner && (
                <div className="bg-indigo-600 text-white px-6 py-1  shadow-md flex justify-between items-center">
                    <p className="text-xs">
                        {user
                            ? "Welcome to ExploreBD! Click your avatar at the top-right to access your Dashboard and account options."
                            : "Welcome to ExploreBD! Please log in to access your Dashboard and account options."}
                    </p>
                    <button className="text-white cursor-pointer font-bold" onClick={handleCloseBanner}>✕</button>
                </div>
            )}
            <Banner></Banner>
            <Overview></Overview>
            <TourismSection></TourismSection>
            <TouristStorySection className="max-w-3xl mx-auto"></TouristStorySection>
            <Testimonials></Testimonials>
            <MostBookedPackages></MostBookedPackages>
        </div>
    );
};

export default Home;