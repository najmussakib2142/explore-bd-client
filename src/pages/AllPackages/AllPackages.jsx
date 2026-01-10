import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Loading from "../shared/Loading/Loading";
import useAxios from "../../hooks/useAxios";
import { Helmet } from "react-helmet-async";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdArrowForward, MdOutlineAccessTime } from "react-icons/md";

const AllPackages = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortOption, setSortOption] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-packages", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/packages?page=${currentPage}&size=${itemsPerPage}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const count = data?.count || 0;
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  const sortedPackages = useMemo(() => {
    const packages = data?.packages || [];
    if (!sortOption) return packages;

    const sorted = [...packages];
    switch (sortOption) {
      case "price-asc":
        sorted.sort(
          (a, b) => (a.price?.$numberInt || a.price) - (b.price?.$numberInt || b.price)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) => (b.price?.$numberInt || b.price) - (a.price?.$numberInt || a.price)
        );
        break;
      case "days-asc":
        sorted.sort((a, b) => a.totalDays - b.totalDays);
        break;
      case "days-desc":
        sorted.sort((a, b) => b.totalDays - a.totalDays);
        break;
      default:
        break;
    }
    return sorted;
  }, [data?.packages, sortOption]);

  const handleItemsPerPage = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500 py-12">Failed to load packages</p>
    );

  return (
    <div className="px-4 md:px-8 lg:px-16 sm:py-12 md:py-16 lg:py-20 max-w-7xl mx-auto">
      <Helmet>
        <title>Explore Trips in Bangladesh | ExploreBD</title>
        <meta
          name="description"
          content="Browse all travel packages in Bangladesh with ExploreBD, from Sundarbans to Cox’s Bazar."
        />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
          Explore All Packages
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover the best trips and adventures across Bangladesh. Choose your perfect tour!
        </p>
      </div>

      {/* Sort */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-3 md:gap-6">
        <label
          htmlFor="sortPackages"
          className="text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Sort Packages:
        </label>
        <select
          id="sortPackages"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-auto bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-primary"
        >
          <option value="">Select Option</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="days-asc">Duration: Short → Long</option>
          <option value="days-desc">Duration: Long → Short</option>
        </select>
      </div>

      {/* Packages */}
      {sortedPackages.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No packages available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {sortedPackages.map((pkg) => (
            <motion.div
              key={pkg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={pkg.images?.[0] || "https://via.placeholder.com/400x300"}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <span className="bg-white/90 backdrop-blur-md text-gray-800 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {pkg.tourType}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 bg-primary px-3 py-1 rounded-lg text-white font-bold shadow-lg">
                  BDT {pkg.price?.$numberInt || pkg.price}
                </div>
              </div>

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
      )}

      {/* Pagination */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 cursor-pointer py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 cursor-pointer py-2 rounded ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
          className="px-4 cursor-pointer py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Next
        </button>

        <select
          value={itemsPerPage}
          onChange={handleItemsPerPage}
          className="ml-3 cursor-pointer border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
        >
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="12">12</option>
          <option value="15">15</option>
        </select>
      </div>
    </div>
  );
};

export default AllPackages;
