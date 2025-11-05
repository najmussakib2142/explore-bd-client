import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

// Skeleton Card Component
const SkeletonCard = () => {
  return (
    <div className="relative min-w-[280px] md:min-w-[320px] lg:min-w-[350px] bg-base-100 rounded-xl overflow-hidden shadow-lg flex-shrink-0 snap-center animate-pulse">
      <div className="w-full h-56 bg-gray-300 dark:bg-gray-700" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="h-5 w-3/4 bg-gray-400 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-400 rounded mb-1"></div>
        <div className="h-4 w-5/6 bg-gray-400 rounded mb-3"></div>
        <div className="h-10 w-full bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};

const MostBookedPackages = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { data: packages = [], isLoading  } = useQuery({
    queryKey: ["topBookedPackages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/top-booked-packages");
      return res.data;
    },
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <section className="py-12 max-w-7xl mx-auto md:py-16 px-4 md:px-8 lg:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
        Most Popular Packages
      </h2>

      <p className="text-center text-lg text-gray-700 dark:text-gray-300 md:text-base mb-8">
        Explore the experiences our travelers love the most and plan your next adventure.
      </p>

      {/* Centered Carousel with Snap */}
      <div className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory px-2 py-4 ">
        {isLoading
          ? // Show 4 skeleton cards while loading
          [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : // Render real packages when loaded
          packages.map((pkg, index) => (
            <motion.div
              key={pkg._id}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative min-w-[280px] md:min-w-[320px] lg:min-w-[350px] 
                  bg-base-100 rounded-xl overflow-hidden shadow-lg cursor-pointer 
                  flex-shrink-0 snap-center transition-transform duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Package Image */}
              <motion.img
                src={pkg.image || "/placeholder.jpg"}
                alt={pkg.title}
                className="w-full h-56 object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: hoveredIndex === index ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 150 }}
              />

              {/* Overlay (always visible on mobile, hover on desktop) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity:
                    hoveredIndex === index || window.innerWidth < 768 ? 1 : 0,
                }}
                className="absolute inset-0 bg-black/40 flex flex-col justify-end p-5 text-white"
              >
                <h3 className="text-lg md:text-xl font-bold line-clamp-1">
                  {pkg.title}
                </h3>
                <p className="text-sm line-clamp-2">
                  {pkg.description
                    ? pkg.description.slice(0, 80) + "..."
                    : "No description available."}
                </p>
                <div className="flex justify-between items-center mt-2 mb-3 text-sm">
                  <span>
                    {pkg.totalDays} {pkg.totalDays > 1 ? "days" : "day"}
                  </span>
                  <span className="font-semibold text-secondary">
                    ৳ {pkg.price?.$numberInt || pkg.price}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                  className="bg-secondary cursor-pointer hover:bg-secondary-dark text-white font-semibold px-4 py-2 rounded-lg w-full"
                >
                  Book Now
                </button>
              </motion.div>
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default MostBookedPackages;
