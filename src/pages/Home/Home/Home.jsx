import React from 'react';
import Banner from '../Banner/Banner';
import Overview from '../Overview/Overview';
import TourismSection from '../TourismSection/TourismSection';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Overview></Overview>
            <TourismSection></TourismSection>
        </div>
    );
};

export default Home;