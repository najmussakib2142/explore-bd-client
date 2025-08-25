import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from "@tanstack/react-query";
import Loading from '../../shared/Loading/Loading';
import Swal from 'sweetalert2';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PendingGuides = () => {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const axiosSecure = useAxiosSecure();

    const { isLoading, data: guides = [], refetch } = useQuery({
        queryKey: ['pending-guides'],
        queryFn: async () => {
            const res = await axiosSecure.get("/guides/pending");
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    if (guides.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Pending Guide Applications</h2>
                <p className="text-gray-500">No pending guide requests at the moment.</p>
            </div>
        );
    }

    const handleDecision = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            const status = action === "approve" ? "active" : "rejected";
            
            await axiosSecure.patch(`/guides/${id}/status`, { status, email });

            refetch();
            Swal.fire("Success", `Guide ${action}d successfully`, "success");
        } catch (err) {
            console.log(err);
            Swal.fire("Error", "Could not update guide status", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Guide Applications</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Role</th>
                            <th>Applied</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {guides.map((guide, index) => (
                                <motion.tr
                                    key={guide._id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`hover:bg-base-100 transition-colors ${index % 2 === 1 ? "bg-base-100 bg-opacity-50" : ""
                                        }`}                                >
                                    <td>{guide.name}</td>
                                    <td>{guide.email}</td>
                                    <td>{guide.age || '-'}</td>
                                    {/* <td>{guide.phone || '-'}</td> */}
                                    <td>{guide.role || "User"}</td>
                                    <td>{new Date(guide.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${guide.status === 'pending' ? 'badge-warning' : guide.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                            {guide.status}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <motion.button
                                            onClick={() => setSelectedGuide(guide)}
                                            className="btn btn-sm btn-info"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaEye />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDecision(guide._id, "approve", guide.email)}
                                            className="btn btn-sm btn-success"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaCheck />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDecision(guide._id, "reject", guide.email)}
                                            className="btn btn-sm btn-error"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaTimes />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Modal for viewing guide details */}
            <AnimatePresence>
                {selectedGuide && (
                    <motion.div
                        className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-xl flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-base-100 p-6 rounded-lg max-w-xl w-full shadow-lg"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h3 className="font-bold text-xl mb-4">{selectedGuide.name} Details</h3>
                            <div className="space-y-2">
                                {selectedGuide.photoURL && (
                                    <img
                                        src={selectedGuide.photoURL}
                                        alt={selectedGuide.name}
                                        className="w-32 h-32 object-cover rounded-full mt-2"
                                    />
                                )}
                                <p><strong>Name:</strong> {selectedGuide.name}</p>
                                <p><strong>Email:</strong> {selectedGuide.email}</p>
                                <p><strong>Phone:</strong> {selectedGuide.phone}</p>
                                <p><strong>Age:</strong> {selectedGuide.age}</p>
                                <p><strong>Location:</strong> {selectedGuide.district}</p>
                                <p><strong>Experience:</strong> {selectedGuide.experience}</p>
                                <p><strong>Bio:</strong> {selectedGuide.bio}</p>
                                <p><strong>Applied At:</strong> {new Date(selectedGuide.created_at).toLocaleString()}</p>

                            </div>
                            <div className="mt-4 text-right">
                                <motion.button
                                    className="btn btn-outline"
                                    onClick={() => setSelectedGuide(null)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PendingGuides;
