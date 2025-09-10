import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../../hooks/useAxios";

const TourismSection = () => {
  const [packages, setPackages] = useState(null); // null = loading
  const [guides, setGuides] = useState(null); // null = loading
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  // Retry fetch up to 2 times to handle Vercel cold starts
  const fetchRandomPackages = async (retry = 0) => {
    try {
      const res = await axiosInstance.get("/packages/random");
      setPackages(Array.isArray(res.data) ? res.data : []);
    } catch {
      if (retry < 2) setTimeout(() => fetchRandomPackages(retry + 1), 500);
      else setPackages([]); // only set empty array after 2 retries
    }
  };

  const fetchRandomGuides = async (retry = 0) => {
    try {
      const res = await axiosInstance.get("/guides/random");
      setGuides(Array.isArray(res.data) ? res.data : []);
    } catch {
      if (retry < 2) setTimeout(() => fetchRandomGuides(retry + 1), 500);
      else setGuides([]);
    }
  };

  useEffect(() => {
    fetchRandomPackages();
    fetchRandomGuides();
  }, []);

  const renderPackages = () => {
    if (packages === null) {
      return (
        <div className="flex justify-center items-center py-12 text-blue-600">
          <FaSpinner className="animate-spin mr-2" />
          Loading packages...
        </div>
      );
    }

    if (packages.length === 0) {
      return (
        <p className="text-center text-gray-500 py-12">No packages available</p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <motion.div
            key={pkg._id}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
            }}
            className="dark:bg-base-100 bg-[#f0fdf4] shadow-lg rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
          >
            <div className="relative overflow-hidden">
              <motion.img
                src={pkg.images?.[0] || "https://via.placeholder.com/300"}
                alt={pkg.title}
                className="w-full h-56 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
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
              <p className="text-lg font-bold text-secondary mb-3">
                BDT {pkg.price?.$numberInt || pkg.price}
              </p>
              <button
                onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                className="btn cursor-pointer btn-primary w-full"
              >
                View Package
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderGuides = () => {
    if (guides === null) {
      return (
        <div className="flex justify-center items-center py-12 text-green-600">
          <FaSpinner className="animate-spin mr-2" />
          Loading guides...
        </div>
      );
    }

    if (guides.length === 0) {
      return (
        <p className="text-center text-gray-500 py-12">No guides available</p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((guide) => (
          <motion.div
            key={guide._id}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
            }}
            className="bg-base-100 shadow-lg rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
          >
            <motion.img
              src={guide.photoURL || "https://via.placeholder.com/300"}
              alt={guide.name}
              className="w-full h-56 object-cover"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
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
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold mb-2 text-center">
        Tourism & Travel Guide
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
        Discover curated packages and meet expert tour guides for your next
        adventure.
      </p>

      <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
        <TabList className="flex justify-center gap-5 mb-6 dark:border-b-2 dark:border-white border-b-2 border-primary">
          <Tab
            selectedClassName="bg-primary border-b-none text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-blue-600 transition"
          >
            Our Packages
          </Tab>
          <Tab
            selectedClassName="bg-primary border-b-none text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-secondary transition"
          >
            Meet Our Tour Guides
          </Tab>
        </TabList>

        <TabPanel>
          <AnimatePresence mode="wait">
            {selectedTab === 0 && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderPackages()}
              </motion.div>
            )}
          </AnimatePresence>
        </TabPanel>

        <TabPanel>
          <AnimatePresence mode="wait">
            {selectedTab === 1 && (
              <motion.div
                key="guides"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {renderGuides()}
              </motion.div>
            )}
          </AnimatePresence>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TourismSection;
