import React from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismSection from '../TourismSection/TourismSection';
import TouristStorySection from '../TouristStorySection/TouristStorySection';
import Testimonials from '../Testimonials/Testimonials';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Overview></Overview>
            <TourismSection></TourismSection>
            <TouristStorySection></TouristStorySection>
            <Testimonials></Testimonials>
        </div>
    );
};

export default Home;