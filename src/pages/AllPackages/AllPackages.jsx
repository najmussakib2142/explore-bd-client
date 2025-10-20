import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { animated } from "@react-spring/web";
import Loading from "../shared/Loading/Loading";
import useAxios from "../../hooks/useAxios";
import { Helmet } from "react-helmet-async";

const AllPackages = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortOption, setSortOption] = useState(""); // "" | "price-asc" | "price-desc" | "days-asc" | "days-desc"

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

  const packages = data?.packages || [];
  const count = data?.count || 0;
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPages).keys()];

  // Handle sorting
  const sortedPackages = useMemo(() => {
    if (!sortOption) return packages;

    const sorted = [...packages];
    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => (a.price?.$numberInt || a.price) - (b.price?.$numberInt || b.price));
        break;
      case "price-desc":
        sorted.sort((a, b) => (b.price?.$numberInt || b.price) - (a.price?.$numberInt || a.price));
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
  }, [packages, sortOption]);

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
    <div className="p-6 md:px-20">
      <Helmet>
        <title>Explore Trips in Bangladesh | ExploreBD</title>
        <meta
          name="description"
          content="Browse all travel packages in Bangladesh with ExploreBD, from Sundarbans to Cox’s Bazar."
        />
      </Helmet>

      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">Explore All Packages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the best trips and adventures across Bangladesh. Choose your perfect tour!
        </p>
      </div>

      {/* Sorting Options */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 gap-4">
        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Sort Packages:
        </h4>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        >
          <option value="">Select Option</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="days-asc">Duration: Short → Long</option>
          <option value="days-desc">Duration: Long → Short</option>
        </select>
      </div>


      {/* Packages Grid */}
      {sortedPackages.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No packages available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedPackages.map((pkg) => (
            <animated.div
              key={pkg._id}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 transform transition-transform duration-300"
              onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={pkg.images?.[0] || "https://via.placeholder.com/300"}
                  alt={pkg.title}
                  className="w-full h-48 object-cover"
                />
                <p className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {pkg.tourType}
                </p>
              </div>
              <div className="p-4">
                <h3 className="text-xl line-clamp-1 font-semibold mb-2">{pkg.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  📍 {pkg.location} • ⏳ {pkg.totalDays} days
                </p>
                <p className="text-lg font-bold text-secondary mb-3">
                  BDT {pkg.price?.$numberInt || pkg.price}
                </p>
                <button className="btn btn-primary w-full">View Package</button>
              </div>
            </animated.div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
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
            className={`px-4 cursor-pointer py-2 rounded ${currentPage === page
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
