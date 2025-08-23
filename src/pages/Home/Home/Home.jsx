import React from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismSection from '../TourismSection/TourismSection';
import TouristStorySection from '../TouristStorySection/TouristStorySection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Overview></Overview>
            <TourismSection></TourismSection>
            <TouristStorySection></TouristStorySection>
        </div>
    );
};

export default Home;