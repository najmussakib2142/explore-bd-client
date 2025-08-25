import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../shared/Loading/Loading";
// import './pagination.css'
import useAxios from "../../hooks/useAxios";
// import Pagination from "../shared/Pagination/Pagination";

const AllPackages = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Fetch packages with server-side pagination
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

    // Pagination handlers
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
        <div className="p-6">
            {packages.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No packages available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="bg-base-100 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-300"
                            data-aos="fade-up"
                        >
                            <img
                                src={pkg.images?.[0] || "https://via.placeholder.com/300"}
                                alt={pkg.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <p className="px-3 py-1 rounded-full w-fit text-sm font-medium bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm">
                                    {pkg.tourType}
                                </p>
                                <h3 className="text-xl mt-2 font-semibold mb-2">{pkg.title}</h3>
                                <p className="text-lg font-bold mb-3">BDT {pkg.price}</p>
                                <button
                                    onClick={() => navigate(`/packageDetailsPage/${pkg._id}`)}
                                    className="btn btn-primary w-full"
                                >
                                    View Package
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="pagination mt-6 flex justify-center items-center gap-2">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                    Prev
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${currentPage === page
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
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                    Next
                </button>
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPage}
                    className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                >
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                </select>
            </div>
            {/* <Pagination
                currentPage={currentPage}
                totalPages={pages.length}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPage}
            ></Pagination> */}
        </div>
    );
};

export default AllPackages;
