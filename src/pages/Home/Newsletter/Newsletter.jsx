import React from "react";
import { motion } from "framer-motion";
import { FaPlaneDeparture } from "react-icons/fa";
import { Link } from "react-router";

const CallToAction = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
      {/* Decorative glowing circle */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 font-roboto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full shadow-inner">
              <FaPlaneDeparture className="text-3xl text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-wide">
            Explore the Wonders of Bangladesh
          </h2>

          {/* Subtext */}
          <p className="text-base md:text-lg font-light text-gray-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover breathtaking destinations, hidden gems, and unforgettable experiences.
            Start your travel journey today with <span className="font-semibold text-white">ExploreBD</span>.
          </p>

          {/* CTA Button */}
          <Link to="/destinations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform"
            >
              Start Exploring
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
