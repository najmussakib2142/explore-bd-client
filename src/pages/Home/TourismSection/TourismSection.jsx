import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../../hooks/useAxios";

// Skeleton Card for loading state
const SkeletonCard = () => {
  return (
    <div className="animate-pulse dark:bg-gray-800 bg-[#f0fdf4] shadow-lg rounded-xl overflow-hidden">
      <div className="h-56 w-full bg-gray-300 dark:bg-gray-600" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-6 w-full bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
};

const TourismSection = () => {
  const [packages, setPackages] = useState(null);
  const [guides, setGuides] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const fetchRandomPackages = async (retry = 0) => {
    try {
      const res = await axiosInstance.get("/packages/random");
      setPackages(Array.isArray(res.data) ? res.data : []);
    } catch {
      if (retry < 2) setTimeout(() => fetchRandomPackages(retry + 1), 500);
      else setPackages([]);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (packages.length === 0) {
      return <p className="text-center text-gray-500 py-12">No packages available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {packages.map((pkg) => (
          <motion.div
            key={pkg._id}
            whileHover={{
              scale: 1.03,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
            }}
            className="dark:bg-gray-800 bg-[#f0fdf4] shadow-lg rounded-xl overflow-hidden cursor-pointer transition-transform duration-300"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (guides.length === 0) {
      return <p className="text-center text-gray-500 py-12">No guides available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
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
              <p className="text-sm line-clamp-1 text-gray-400 mb-3">
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
    <div className="max-w-7xl mx-auto sm:py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center">
        Tourism & Travel Guide
      </h2>
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-8">
        Discover curated packages and meet expert tour guides for your next
        adventure.
      </p>

      <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
        <TabList className="flex justify-center gap-4 mb-6 dark:border-b-2 dark:border-white border-b-2 border-primary">
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
