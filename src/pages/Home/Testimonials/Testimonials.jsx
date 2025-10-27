import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useTrail, animated } from '@react-spring/web';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Testimonials.css';
import reviewImg from '../../../assets/travel-top.png';
import reviewQuote from '../../../assets/reviewQuote.png';
import { Typewriter } from "react-simple-typewriter";

// Travel-themed reviews
const reviews = [
    {
        id: 1,
        review: "Exploring the Sundarbans with ExploreBD was unforgettable! The guide was knowledgeable and friendly.",
        customerImg: "https://randomuser.me/api/portraits/women/11.jpg",
        name: "Sophia Turner",
        designation: "Nature Enthusiast"
    },
    {
        id: 2,
        review: "Cox's Bazar tour exceeded my expectations. Stunning beaches and perfect planning!",
        customerImg: "https://randomuser.me/api/portraits/men/21.jpg",
        name: "Liam Wilson",
        designation: "Traveler"
    },
    {
        id: 3,
        review: "A beautiful and hassle-free trip to Srimangal. Highly recommended!",
        customerImg: "https://randomuser.me/api/portraits/women/31.jpg",
        name: "Olivia Smith",
        designation: "Tea Lover"
    },
    {
        id: 4,
        review: "The historic city tours in Dhaka were eye-opening. Guides were friendly and informative.",
        customerImg: "https://randomuser.me/api/portraits/men/41.jpg",
        name: "Noah Brown",
        designation: "History Enthusiast"
    },
    {
        id: 5,
        review: "I loved the river cruise in Kuakata. A serene experience with amazing views!",
        customerImg: "https://randomuser.me/api/portraits/women/51.jpg",
        name: "Emma Johnson",
        designation: "Traveler"
    },
];

const Testimonials = () => {
    // Trail animation for all cards
    const trail = useTrail(reviews.length, {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0 },
        config: { tension: 170, friction: 20 },
        delay: 200,
    });

    return (
        <section className="py-10  px-5 md:px-20">
            {/* Decorative Top Image */}
            <div className="text-center mb-8">
                <img src={reviewImg} alt="Travel decoration" className="mx-auto max-h-44 mb-3" />

                <h2 className="text-3xl md:text-4xl font-bold text-center">
                    What our travelers{" "}
                    <span className="text-secondary">
                        <Typewriter
                            words={["say", "share", "recommend", "love"]}
                            loop={0}   // 0 = infinite loop
                            cursor
                            cursorStyle="|"
                            typeSpeed={120}
                            deleteSpeed={60}
                            delaySpeed={1000}
                        />
                    </span>
                </h2>
                <p className="max-w-2xl mx-auto pt-3 text-gray-700 dark:text-gray-300 mb-10">
                    Hear from our travelers! Explore Bangladesh's hidden gems, breathtaking sights, and unforgettable experiences with ExploreBD.
                </p>
            </div>

            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                centeredSlides={true}
                loop={true}
                navigation={true}
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                className="testimonialSwiper mb-10"
                grabCursor={true}         
                simulateTouch={true}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 20 },
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 25 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
            >
                {trail.map((style, index) => {
                    const review = reviews[index];
                    return (
                        <SwiperSlide key={review.id}>
                            <animated.div
                                style={{
                                    ...style,
                                    transform: style.y.to((y) => `translateY(${y}px)`),
                                }}
                                className="dark:bg-base-100 bg-[#f0fdf4] p-6 md:p-8 rounded-xl shadow-md h-[300px] md:h-[350px] flex flex-col justify-between"
                            >
                                <img src={reviewQuote} alt="" className=" w-10 h-10" />
                                <p className="mb-2 border-b border-dotted border-gray-300 dark:border-gray-600 pb-2 text-gray-800 dark:text-gray-200 text-lg">
                                    "{review.review}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        className="w-14 h-14 rounded-full object-cover"
                                        src={review.customerImg}
                                        alt={review.name}
                                    />
                                    <div>
                                        <h4 className="font-bold text-secondary">{review.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{review.designation}</p>
                                    </div>
                                </div>
                            </animated.div>

                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );
};

export default Testimonials;
