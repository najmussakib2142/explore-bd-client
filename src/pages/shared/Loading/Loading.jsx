import React from "react";
import { FaSpinner, FaGlobeAsia } from "react-icons/fa";
import { motion } from "framer-motion";

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            {/* Spinner */}
            <motion.div
                className="text-primary"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <FaSpinner className="text-6xl" />
            </motion.div>

            {/* Text Animation */}
            <motion.h2
                className="mt-6 text-2xl font-bold text-primary flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
                <FaGlobeAsia className="text-primary" />
                Loading ExploreBD...
            </motion.h2>
        </div>
    );
};

export default Loading;
