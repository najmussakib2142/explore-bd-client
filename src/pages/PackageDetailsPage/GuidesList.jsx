import React, {  } from "react";
import { useNavigate } from "react-router";
import Loading from "../shared/Loading/Loading";

const GuideList = ({ guides,
    guidesLoading,
    guidesError,
    currentPage,
    setCurrentPage,
    // itemsPerPage,
    // setItemsPerPage,
    totalPages, }) => {
    // const [currentPage, setCurrentPage] = useState(0);
    // const [itemsPerPage, setItemsPerPage] = useState(6);
    const navigate = useNavigate();

    if (guidesLoading) return <Loading />;
    if (guidesError) return <p className="text-center text-red-500">Failed to load guides</p>;
    if (guides.length === 0) return <p className="text-center text-gray-500">No guides available</p>;

    // Pagination logic
    // const totalPages = Math.ceil(guides.length / itemsPerPage);
    // const indexOfLastGuide = (currentPage + 1) * itemsPerPage;
    // const indexOfFirstGuide = indexOfLastGuide - itemsPerPage;
    // const currentGuides = guides.slice(indexOfFirstGuide, indexOfLastGuide);

    // const pages = Array.from({ length: totalPages }, (_, i) => i);

    // const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
    // const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    // const handleItemsPerPage = (e) => {
    //     setItemsPerPage(Number(e.target.value));
    //     setCurrentPage(0); // reset to first page
    // };

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
            <h3 className="text-2xl font-semibold mb-6 text-center" data-aos="fade-down">
                Available Tour Guides
            </h3>

            <div className="space-y-4">
                {guides.map((guide, idx) => (
                    <div
                        key={guide._id}
                        className="bg-white hover:scale-102 transition-transform ease-in-out  duration-2000 dark:bg-gray-800 rounded-xl shadow-md p-5 flex items-center justify-between hover:shadow-xl"
                        data-aos="fade-up"
                        data-aos-delay={idx * 100} // stagger effect
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={guide.photoURL || "https://via.placeholder.com/100"}
                                alt={guide.name}
                                className="w-20 h-20  object-cover rounded-full border-2 border-gray-200 dark:border-gray-600"
                                data-aos="zoom-in"
                            />
                            <div >
                                <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">{guide.name}</p>
                                <p className="text-sm text-gray-500 hidden md:block dark:text-gray-400">
                                    District: {guide.district || "N/A"}
                                </p>
                                <p className="text-sm line-clamp-2  text-gray-500 dark:text-gray-400">
                                    <span className="">Experience:</span> {guide.experience || "N/A"}
                                </p>
                            </div>
                        </div>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/guides/${guide._id}`)}
                            data-aos="fade-left"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination mt-6 flex justify-center items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    className="px-3 cursor-pointer py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 cursor-pointer py-1 rounded ${currentPage === page ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage === totalPages - 1}
                    className="px-3 cursor-pointer py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                    Next
                </button>

                {/* <select
                    value={itemsPerPage}
                    onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(0); }}
                    className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                >
                    <option value="3">3</option>
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                </select> */}
            </div>
        </div>
    );
};

export default GuideList;
