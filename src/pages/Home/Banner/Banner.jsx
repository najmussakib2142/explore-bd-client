import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sundarbans from '../../../assets/Sundarbans.jpg';
import Srimangal from '../../../assets/Srimangal.jpg';
import Coxs from '../../../assets/coxs.jpg';
import { useNavigate } from "react-router";

const slides = [
    {
        image: Sundarbans,
        title: "Explore the Sundarbans",
        text: "Discover the world's largest mangrove forest with ExploreBD.",
    },
    {
        image: Coxs,
        title: "Relax at Cox’s Bazar",
        text: "Walk along the world’s longest unbroken sandy beach.",
    },
    {
        image: Srimangal,
        title: "Tea Gardens of Srimangal",
        text: "Breathe in the freshness of endless green tea estates.",
    },
];

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate()

    // Auto slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
            <AnimatePresence>
                {slides.map((slide, index) =>
                    index === current ? (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50"></div>

                            {/* Text Overlay with slide-in effect */}
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                                <motion.h1
                                    key={slide.title} // forces re-animation when slide changes
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 1 }}
                                    className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
                                >
                                    {slide.title}
                                </motion.h1>
                                <motion.p
                                    key={slide.text}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                    className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl"
                                >
                                    {slide.text}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 30 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="mt-6 flex gap-4"
                                >
                                    <button onClick={() => navigate("/allTrips")} className="btn btn-primary">Explore More</button>
                                    <button onClick={() => navigate("/allTrips")} className="btn btn-secondary">Plan Trip</button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null
                )}
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 w-full flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full ${current === index ? "bg-primary" : "bg-white/50"}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Banner;
