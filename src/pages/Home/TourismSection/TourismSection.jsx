import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../../hooks/useAxios";
import { FaMapMarkerAlt, FaRegHeart, FaGraduationCap, FaEnvelope, FaBriefcase, FaUserClock } from "react-icons/fa";
import { MdOutlineAccessTime, MdArrowForward, MdVerified } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";

// Skeleton Card for loading state
const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Image Area Skeleton */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-800">
        {/* Tour Type Badge Skeleton */}
        <div className="absolute top-4 left-4 h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        {/* Price Tag Skeleton */}
        <div className="absolute bottom-4 left-4 h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      </div>

      {/* Content Area Skeleton */}
      <div className="p-5 space-y-4">
        {/* Location Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-full" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        {/* Title Skeleton */}
        <div className="h-7 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-md" />

        {/* About/Description Lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-800/50 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 dark:bg-gray-800/50 rounded" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          {/* Days Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          {/* Button Link Skeleton */}
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {packages.map((pkg) => (
          <motion.div
            key={pkg._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <motion.img
                src={pkg.images?.[0] || "https://via.placeholder.com/400x300"}
                alt={pkg.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {pkg.tourType}
                </span>
              </div>

              {/* Favorite Button */}
              {/* <button className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors duration-300">
                <FaRegHeart className="text-lg" />
              </button> */}

              {/* Price Tag Overlay */}
              <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-lg text-white font-bold shadow-lg">
                BDT {pkg.price?.$numberInt || pkg.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center gap-1 text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                <FaMapMarkerAlt />
                {pkg.location}
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                {pkg.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                {pkg.about}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MdOutlineAccessTime className="text-xl text-primary" />
                  <span className="text-sm font-semibold">{pkg.totalDays} Days</span>
                </div>

                <button
                  onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                  className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all underline-offset-4 hover:underline"
                >
                  DETAILS <MdArrowForward />
                </button>
              </div>
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
      return (
        <div className="flex flex-col items-center py-20 text-center w-full">
          <div className="bg-gray-100 p-6 rounded-full mb-4 text-4xl text-gray-300">👤</div>
          <p className="text-xl font-medium text-gray-500">No guides found in this category.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <motion.div
            key={guide._id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Top Section: Photo & Quick Stats */}
            <div className="flex p-5 gap-4">
              <img
                src={guide.photoURL || "https://via.placeholder.com/150"}
                alt={guide.name}
                className="w-24 h-24 rounded-lg object-cover ring-2 ring-gray-100 dark:ring-gray-800"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {guide.name}
                </h3>
                <div className="flex items-center gap-1 text-primary font-medium text-sm mt-1">
                  <FaMapMarkerAlt className="text-xs" />
                  {guide.district}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {guide.experience} Exp
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Age: {guide.age}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: Bio (Informative) */}
            <div className="px-5 pb-4 flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border-l-4 border-primary">
                {guide.bio || "No bio provided."}
              </p>
            </div>

            {/* Bottom Section: Real Data Points */}
            <div className="px-5 pb-5 mt-auto">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaBriefcase className="text-gray-400" />
                  <span className="truncate">Active Guide</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <HiOutlineIdentification className="text-gray-400" />
                  <span className="truncate">Verified NID</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/guides/${guide._id}`)}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary transition-colors duration-300"
              >
                See Full Profile
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
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-primary transition"
          >
            Our Packages
          </Tab>
          <Tab
            selectedClassName="bg-primary border-b-none text-white dark:bg-white dark:text-black rounded-t-md"
            className="cursor-pointer py-2 px-4 text-lg font-semibold hover:text-primary transition"
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
