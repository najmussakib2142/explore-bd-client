import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../shared/Loading/Loading";
import { useSprings, animated } from "@react-spring/web";
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

  // React Spring animations for hover effect
  const springs = useSprings(
    packages.length,
    packages.map((_, index) => ({
      transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
      boxShadow:
        hoveredIndex === index
          ? "0px 20px 40px rgba(0,0,0,0.2)"
          : "0px 5px 15px rgba(0,0,0,0.1)",
      config: { mass: 1, tension: 220, friction: 20 },
    }))
  );

  if (isLoading) return <Loading />;

  return (
    <section className="py-16 px-5 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-secondary mb-12">
        Most Popular Tours
      </h2>
      <div className="grid gap-4 md:gap-5 md:grid-cols-3">
        {packages.map((pkg, index) => (
          <animated.div
            key={pkg._id}
            style={springs[index]}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="bg-base-100 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <animated.img
              src={pkg.image || "/placeholder.jpg"}
              alt={pkg.title}
              className="w-full h-56 object-cover"
              style={{
                transform:
                  hoveredIndex === index ? "translateY(-5px)" : "translateY(0px)",
                transition: "transform 0.3s",
              }}
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
                {pkg.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {pkg.description
                  ? pkg.description.slice(0, 100) + "..."
                  : "No description available."}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {pkg.totalDays} {pkg.totalDays > 1 ? "days" : "day"}
                </span>
                <span className="text-sm font-semibold text-secondary">
                  ৳ {pkg.price?.$numberInt || pkg.price}
                </span>
              </div>
              <button
                onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                className="bg-secondary hover:bg-secondary-dark text-white font-semibold px-4 py-2 rounded-lg w-full"
              >
                Book Now
              </button>
            </div>
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default MostBookedPackages;
