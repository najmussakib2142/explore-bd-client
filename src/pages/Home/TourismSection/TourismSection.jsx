import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router";
import { FaSpinner } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSprings, animated } from "@react-spring/web";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../../hooks/useAxios";

const TourismSection = () => {
  const [packages, setPackages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const fetchRandomPackages = async () => {
    try {
      setLoadingPackages(true);
      const res = await axiosInstance.get("/packages/random");
      setPackages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchRandomGuides = async () => {
    try {
      setLoadingGuides(true);
      const res = await axiosInstance.get("/guides/random");
      setGuides(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setGuides([]);
    } finally {
      setLoadingGuides(false);
    }
  };

  useEffect(() => {
    fetchRandomPackages();
    fetchRandomGuides();
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Hover springs
  const packageSprings = useSprings(
    packages.length,
    packages.map((_, index) => ({
      transform: hoveredIndex === index ? "scale(1.03)" : "scale(1)",
      boxShadow:
        hoveredIndex === index
          ? "0px 15px 30px rgba(0,0,0,0.2)"
          : "0px 5px 15px rgba(0,0,0,0.1)",
      config: { mass: 1, tension: 210, friction: 20 },
    }))
  );

  const guideSprings = useSprings(
    guides.length,
    guides.map((_, index) => ({
      transform: hoveredIndex === index ? "scale(1.03)" : "scale(1)",
      boxShadow:
        hoveredIndex === index
          ? "0px 15px 30px rgba(0,0,0,0.2)"
          : "0px 5px 15px rgba(0,0,0,0.1)",
      config: { mass: 1, tension: 210, friction: 20 },
    }))
  );

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold mb-2 text-center">Tourism & Travel Guide</h2>
      <p className="text-center text-gray-500 mb-6">
        Discover curated packages and meet expert tour guides for your next adventure.
      </p>

      <Tabs selectedIndex={selectedTab} onSelect={index => setSelectedTab(index)}>
        <TabList className="flex justify-center gap-4 mb-6 dark:border-b-2 dark:border-white border-b-2 border-primary">
          <Tab
            selectedClassName="bg-primary border-b-none text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-blue-600 transition"
          >
            Our Packages
          </Tab>
          <Tab
            selectedClassName="bg-primary border-b-none text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-green-600 transition"
          >
            Meet Our Tour Guides
          </Tab>
        </TabList>

        <AnimatePresence mode="wait">
          {/* Packages Tab */}
          {selectedTab === 0 && (
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {loadingPackages ? (
                <div className="flex justify-center items-center py-12 text-blue-600">
                  <FaSpinner className="animate-spin mr-2" />
                  Loading packages...
                </div>
              ) : packages.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No packages available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((pkg, index) => (
                    <animated.div
                      key={pkg._id}
                      style={packageSprings[index]}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="dark:bg-base-100 bg-[#f0fdf4] shadow-lg rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
                      data-aos="fade-up"
                    >
                      <div className="relative overflow-hidden">
                        <animated.img
                          src={pkg.images?.[0] || "https://via.placeholder.com/300"}
                          alt={pkg.title}
                          style={{
                            transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                            transition: "transform 0.4s ease",
                          }}
                          className="w-full  h-48 object-cover"
                        />
                        <p className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                          {pkg.tourType}
                        </p>
                      </div>


                      <div className="p-4">

                        <h3 className="text-xl mt-2 font-semibold mb-2">{pkg.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          📍 {pkg.location} • ⏳ {pkg.totalDays} days
                        </p>
      <p className="text-lg font-bold text-secondary mb-3">BDT {pkg.price?.$numberInt || pkg.price}</p>
                        <button
                          onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                          className="btn cursor-pointer btn-primary w-full"
                        >
                          View Package
                        </button>
                      </div>
                    </animated.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Guides Tab */}
          {selectedTab === 1 && (
            <motion.div
              key="guides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {loadingGuides ? (
                <div className="flex justify-center items-center py-12 text-green-600">
                  <FaSpinner className="animate-spin mr-2" />
                  Loading guides...
                </div>
              ) : guides.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No guides available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {guides.map((guide, index) => (
                    <animated.div
                      key={guide._id}
                      style={guideSprings[index]}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="bg-base-100 shadow-lg rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
                      data-aos="fade-up"
                    >
                      <animated.img
                        src={guide.photoURL || "https://via.placeholder.com/300"}
                        alt={guide.name}
                        style={{
                          transform:
                            hoveredIndex === index ? "translateY(-5px)" : "translateY(0px)",
                          transition: "transform 0.3s",
                        }}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-1">{guide.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          District: {guide.district || "N/A"}
                        </p>
                        <p className="text-sm line-clamp-2 text-gray-400 mb-3">
                          Experience: {guide.experience || "N/A"}
                        </p>
                        <button
                          onClick={() => navigate(`/guides/${guide._id}`)}
                          className="btn btn-secondary w-full"
                        >
                          Details
                        </button>
                      </div>
                    </animated.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default TourismSection;
