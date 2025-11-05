import React, { useEffect, useState } from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismSection from '../TourismSection/TourismSection';
import TouristStorySection from '../TouristStorySection/TouristStorySection';
import Testimonials from '../Testimonials/Testimonials';
import MostBookedPackages from '../MostBookedPackages/MostBookedPackages';
import useAuth from '../../../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import Newsletter from '../Newsletter/Newsletter';
// import RegionExplorer from '../RegionExplorer/RegionExplorer';
import BangladeshMap from '../BangladeshMap/BangladeshMap';
import HowItWorksSection from '../../HowItWorksSection/HowItWorksSection';

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
        <div className="animated-bg min-h-screen transition-colors duration-700">
            <div className=" mx-auto">
                <Helmet>
                    <title>ExploreBD | Discover Bangladesh</title>
                    <meta
                        name="description"
                        content="ExploreBD helps you discover the Sundarbans, Cox’s Bazar, and more travel destinations in Bangladesh."
                    />
                </Helmet>

                {showBanner && (
                    <div className="bg-indigo-600 text-white px-6 py-1 shadow-md flex justify-between items-center">
                        <p className="text-xs">
                            {user
                                ? "Welcome to ExploreBD! Click your avatar at the top-right to access your Dashboard and account options."
                                : "Welcome to ExploreBD! Please log in to access your Dashboard and account options."}
                        </p>
                        <button
                            className="text-white cursor-pointer font-bold"
                            onClick={handleCloseBanner}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <Banner />
                <Overview />
                <HowItWorksSection />
                <TourismSection />
                <MostBookedPackages />
                <BangladeshMap />
                <TouristStorySection className="max-w-3xl mx-auto" />
                <Testimonials />
            </div>
        </div>
    );

};

export default Home;