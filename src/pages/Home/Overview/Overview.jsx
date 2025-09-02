import React from "react";
// import { motion } from "framer-motion";
import { motion } from "motion/react"
import video from '../../../assets/video.mp4';
import { useNavigate } from "react-router";

const Overview = () => {
  const navigate = useNavigate()
  return (
    <section className="py-13 ">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 px-4">

        {/* Video with animation */}
        <motion.div
          className="md:w-1/2 w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        >
          <video
            src={video}
            autoPlay
            loop
            muted
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </motion.div>

        {/* Text content with animation */}
        <motion.div
          className="md:w-1/2 w-full flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Bangladesh with ExploreBD
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            ExploreBD is your ultimate travel guide for Bangladesh. Find detailed
            descriptions of popular tourist destinations, uncover hidden gems,
            learn about local culture, cuisine, and activities to make your trips
            unforgettable.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Whether you are planning a short getaway or a long adventure, ExploreBD
            gives you all the information you need to make the most of your journey.
          </p>
          <button onClick={() =>navigate('/communityPage') } className="btn btn-primary w-max">Learn More</button>
        </motion.div>

      </div>
    </section>
  );
};

export default Overview;
