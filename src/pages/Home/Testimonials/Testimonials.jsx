import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Testimonials.css';  // Custom CSS for active/blur effect
import reviewImg from '../../../assets/customer-top.png'
import reviewQuote from '../../../assets/reviewQuote.png'

const reviews = [
    {
        id: 1,
        review: "Profast Courier has streamlined our logistics. Their service is efficient and dependable.",
        customerImg: "https://randomuser.me/api/portraits/women/11.jpg",
        name: "Sophia Turner",
        designation: "Logistics Manager"
    },
    {
        id: 2,
        review: "The best delivery partner we’ve worked with. Fast and secure deliveries every time.",
        customerImg: "https://randomuser.me/api/portraits/men/21.jpg",
        name: "Liam Wilson",
        designation: "Retail Business Owner"
    },
    {
        id: 3,
        review: "Excellent cash on delivery handling. They always ensure prompt remittance.",
        customerImg: "https://randomuser.me/api/portraits/women/31.jpg",
        name: "Olivia Smith",
        designation: "Online Store Founder"
    },
    {
        id: 4,
        review: "Their delivery hubs are well-organized, and parcels reach customers on time.",
        customerImg: "https://randomuser.me/api/portraits/men/41.jpg",
        name: "Noah Brown",
        designation: "E-commerce Consultant"
    },
    {
        id: 5,
        review: "We love how Profast Courier handles corporate shipments with care and professionalism.",
        customerImg: "https://randomuser.me/api/portraits/women/51.jpg",
        name: "Emma Johnson",
        designation: "Corporate Account Manager"
    },
    {
        id: 6,
        review: "Highly recommend their SME delivery solutions. Perfect for small businesses like ours.",
        customerImg: "https://randomuser.me/api/portraits/men/61.jpg",
        name: "James Miller",
        designation: "Startup Founder"
    },
    {
        id: 7,
        review: "Reliable courier service with excellent support. Queries are resolved quickly.",
        customerImg: "https://randomuser.me/api/portraits/women/71.jpg",
        name: "Isabella Martinez",
        designation: "Customer Success Lead"
    },
    {
        id: 8,
        review: "Their parcel tracking system is very user-friendly and accurate.",
        customerImg: "https://randomuser.me/api/portraits/men/81.jpg",
        name: "Benjamin Davis",
        designation: "Supply Chain Manager"
    },
    {
        id: 9,
        review: "Impressed by their commitment to delivering even in remote areas.",
        customerImg: "https://randomuser.me/api/portraits/women/91.jpg",
        name: "Mia Rodriguez",
        designation: "Logistics Supervisor"
    },
    {
        id: 10,
        review: "Profast Courier has exceeded our expectations. They are our go-to delivery partner.",
        customerImg: "https://randomuser.me/api/portraits/men/10.jpg",
        name: "William Garcia",
        designation: "Operations Head"
    }
];

const Testimonials = () => {

    return (
        <section className="py-10  px-5  md:px-20">
            <div className='items-center text-center'>
                <img src={reviewImg} alt="Decoration" className="mx-auto mb-6" />

                {/* Title */}
                <h2 className="text-3xl text-secondary font-bold mb-2">What our clients are saying</h2>

                {/* Subtext */}
                <p className="max-w-2xl mx-auto text-gray-400 mb-10">
                    Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
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
                className="testimonialSwiper"
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >

                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <div className="bg-gray-100 p-6 md:p-8 rounded-xl shadow-md transition duration-300 ease-in-out">
                            <img src={reviewQuote} alt="" />
                            <p className="mb-4 border-b border-dotted border-gray-300 pb-2 text-gray-700 text-lg">"{review.review}"</p>
                            <div className='flex gap-4 items-center'>
                                <img className='w-14 h-14 rounded-full object-cover' src={review.customerImg} alt={review.name} />
                                <div>
                                    <h4 className="font-bold text-secondary">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.designation}</p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Testimonials;
