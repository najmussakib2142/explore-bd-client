import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import Loading from "../../../shared/Loading/Loading";
import { useNavigate } from "react-router";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../shared/Loading/Loading";

const GuideList = ({ guides, guidesLoading, guidesError }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const guidesPerPage = 6;
    const navigate = useNavigate();
    // const axiosSecure = useAxiosSecure();


    if (guidesLoading) return <Loading />;
    if (guidesError) return <p className="text-center text-red-500">Failed to load guides</p>;
    if (guides.length === 0) return <p className="text-center text-gray-500">No guides available</p>;

    // Pagination logic
    const totalPages = Math.ceil(guides.length / guidesPerPage);
    const indexOfLastGuide = currentPage * guidesPerPage;
    const indexOfFirstGuide = indexOfLastGuide - guidesPerPage;
    const currentGuides = guides.slice(indexOfFirstGuide, indexOfLastGuide);

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
    };

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
            <h3 className="text-2xl font-semibold mb-6 text-center">Available Tour Guides</h3>

            <div className="space-y-4">
                {currentGuides.map((guide) => (
                    <div
                        key={guide._id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-between hover:shadow-xl transition"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={guide.photoURL || "https://via.placeholder.com/100"}
                                alt={guide.name}
                                className="w-20 h-20 object-cover rounded-full border-2 border-gray-200 dark:border-gray-600"
                            />
                            <div>
                                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{guide.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    District: {guide.district || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Experience: {guide.experience || "N/A"} yrs
                                </p>
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/guides/${guide._id}`)}
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx}
                        className={`px-3 py-1 rounded ${
                            currentPage === idx + 1
                                ? "bg-primary text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => handlePageChange(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GuideList;
