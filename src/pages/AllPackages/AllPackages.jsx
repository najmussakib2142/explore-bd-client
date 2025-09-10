import React, { useState } from "react";
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
      <p className="text-center text-red-500 py-12">
        Failed to load packages
      </p>
    );

  return (
    <div className="p-6 md:px-20">
      <Helmet>
        <title>Explore Trips in Bangladesh | ExploreBD</title>
        <meta
          name="description"
          content="Browse all travel packages in Bangladesh with ExploreBD, from Sundarbans to Cox’s Bazar."
        />
        <meta property="og:title" content="Explore Trips in Bangladesh | ExploreBD" />
        <meta
          property="og:description"
          content="Find your next adventure and book top travel packages across Bangladesh."
        />
        <meta property="og:image" content="https://i.ibb.co/all-packages.jpg" />
      </Helmet>
      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary mb-2">Explore All Packages</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the best trips and adventures across Bangladesh. Choose your perfect tour!
        </p>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No packages available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
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
