import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";

const ActiveGuides = () => {
    const axiosInstance = useAxios();

    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [selectedGuide, setSelectedGuide] = useState(null); // detail modal

    // Fetch paginated guides
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["activeGuides", currentPage, itemsPerPage],
        queryFn: async () => {
            const res = await axiosInstance.get(`/guides/approved?page=${currentPage}&limit=${itemsPerPage}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const guides = data?.guides || [];
    const count = data?.count || 0;
    const numberOfPages = Math.ceil(count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    // Deactivate guide
    const handleDeactivate = async (id, email) => {
        const confirm = await Swal.fire({
            title: "Deactivate this guide?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, deactivate",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosInstance.patch(`/guides/${id}/status`, { status: "rejected", email });
            Swal.fire("Success", "Guide deactivated successfully", "success");
            refetch();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to deactivate guide", "error");
        }
    };

    // Filtered search
    const filteredGuides = guides.filter((guide) =>
        guide.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Guides</h2>

            {/* Search */}
            <div className="mb-4 flex items-center gap-2">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search by name"
                    className="input input-bordered w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Loading/Error */}
            {isLoading && <p className="text-center">Loading active guides...</p>}
            {error && <p className="text-center text-red-500">Failed to load guides</p>}

            {/* Guides Table */}
            {!isLoading && !error && (
                <>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-100">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Experience</th>
                                    <th>NID</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGuides.map((guide, idx) => (
                                    <tr key={idx} className="cursor-pointer" onClick={() => setSelectedGuide(guide)}>
                                        <td>{idx+1}</td>
                                        <td>{guide.name}</td>
                                        <td>{guide.email}</td>
                                        <td>{guide.phone}</td>
                                        <td className="line-clamp-1">{guide.experience}</td>
                                        <td>{guide.nid}</td>
                                        <td><span className="badge badge-success text-white">Active</span></td>
                                        <td>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeactivate(guide._id, guide.email); }}
                                                className="btn btn-sm btn-error"
                                            >
                                                <FaUserSlash className="mr-1" /> Deactivate
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredGuides.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-500">
                                            No matching guides found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mt-4">
                        <button
                            className="btn btn-sm"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        >
                            Prev
                        </button>
                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`btn btn-sm ${currentPage === page ? "btn-primary" : ""}`}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            className="btn btn-sm"
                            disabled={currentPage === numberOfPages - 1}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numberOfPages - 1))}
                        >
                            Next
                        </button>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(0); }}
                            className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                        >
                            {[10, 20, 30, 50].map((num) => <option key={num} value={num}>{num}</option>)}
                        </select>
                    </div>
                </>
            )}

            {/* Detail Modal */}
            {selectedGuide && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedGuide(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-2">{selectedGuide.name}</h3>
                        <p><strong>Email:</strong> {selectedGuide.email}</p>
                        <p><strong>Phone:</strong> {selectedGuide.phone}</p>
                        <p><strong>Experience:</strong> {selectedGuide.experience}</p>
                        <p><strong>NID:</strong> {selectedGuide.nid}</p>
                        <p><strong>Status:</strong> <span className="badge badge-success text-white">Active</span></p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setSelectedGuide(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveGuides;
