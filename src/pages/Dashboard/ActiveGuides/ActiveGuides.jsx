import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveGuides = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    // 🟡 Load Active Riders with React Query
    const { data: guides = [], isLoading, refetch, error } = useQuery({
        queryKey: ["activeRiders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/guides/approved");
            return res.data;
        },
    });

    // 🔴 Handle Deactivation
    // const handleDeactivate = async (id) => {
    //     const confirm = await Swal.fire({
    //         title: "Deactivate this rider?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Yes, deactivate",
    //         cancelButtonText: "Cancel",
    //     });

    //     if (!confirm.isConfirmed) return;

    //     try {
    //         const status = action === "approve" ? "active" : "rejected";

    //         await axiosSecure.patch(`/guides/${id}/status`, { status: "deactivated" });
    //         Swal.fire("Done", "Guide has been deactivated", "success");
    //         refetch();
    //     } catch (error) {
    //         console.error(error);
    //         Swal.fire("Error", "Failed to deactivate guide", "error");
    //     }
    // };

        const handleDeactivate = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: "Deactivate this rider?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, deactivate",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status = action === "rejected" ? "active" : "rejected";
            
            await axiosSecure.patch(`/guides/${id}/status`, { status, email });

            refetch();
            Swal.fire("Success", `Guide ${action}d successfully`, "success");
        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Could not update guide status", "error");
        }
    };


    // 🔎 Filtered List
    const filteredGuides = guides.filter((guide) =>
        guide.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Guide</h2>

            {/* 🔍 Search Field */}
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

            {/* 🌀 Loading/Error */}
            {isLoading && <p className="text-center">Loading active guides...</p>}
            {error && <p className="text-center text-red-500">Failed to load guides</p>}

            {/* 📊 Rider Table */}
            {!isLoading && !error && (
                <div className="overflow-x-auto">
                    <table className="table  w-full">
                        <thead className="bg-base-100">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>Experience</th>
                                <th>NID</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGuides.map((guide) => (
                                <tr className="" key={guide._id}>
                                    <td>{guide.name}</td>
                                    <td>{guide.email}</td>
                                    <td>{guide.phone}</td>
                                    <td>{guide.district}</td>
                                    <td>{guide.experience}</td>
                                    <td>{guide.nid}</td>
                                    <td><span className="badge badge-success text-white">Active</span></td>
                                    <td>
                                        <button
                                            onClick={() => handleDeactivate(guide._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            <FaUserSlash className="mr-1" /> Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredGuides.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500">
                                        No matching guides found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActiveGuides;