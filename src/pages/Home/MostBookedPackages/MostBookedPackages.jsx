import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../shared/Loading/Loading";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const MostBookedPackages = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["topBookedPackages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/top-booked-packages");
      return res.data;
    },
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 px-5 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Most Popular{" "}
        <span className="text-primary border-b-4 border-primary pb-1">
          Packages
        </span>
      </h2>

      <p className="text-center pt-2 text-gray-700 dark:text-gray-300 md:text-base mb-6">
        Explore the experiences our travelers love the most and plan your next adventure.
      </p>

      {/* Centered Carousel with Snap */}
      <div className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 px-2">
        {packages.map((pkg, index) => (
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
                <span>{pkg.totalDays} {pkg.totalDays > 1 ? "days" : "day"}</span>
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
