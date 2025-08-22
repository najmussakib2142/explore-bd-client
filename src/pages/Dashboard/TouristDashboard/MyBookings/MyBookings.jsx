import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../shared/Loading/Loading";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

const MyBookings = () => {
    const { user } = useAuth();
    const axiosInstance = useAxios();
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate()

    const {
        data: bookings = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["my-bookings", user?.uid],
        queryFn: async () => {
            const res = await axiosInstance.get(`/bookings/user/${user.uid}`);
            return res.data;
        },
        enabled: !!user,
    });

    const handlePay = (id) => {
        console.log("Proceed to payment for", id);
        navigate(`/dashboard/payment/${id}`)
    };


    // 🔴 Delete Booking Function
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to recover this booking!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/bookings/${id}`)
                        .then(res => {
                            // console.log(res.data);
                            if (res.data.deletedCount) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Parcel has been deleted.",
                                    icon: "success",
                                    timer: 1500,
                                    showConfirmButton: false,
                                });
                            }
                            refetch();
                        })
                } catch (err) {
                    Swal.fire("Error", err.message || "Failed to delete booking.", "error");
                }
            }
        });
    };

    if (isLoading) return <Loading />;
    if (bookings.length === 0)
        return <p className="p-6">You have no bookings yet.</p>;

    return (
        <div className="p-6 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            <table className="table w-full border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-base-100">
                        <th>#</th>
                        <th>Package</th>
                        <th>Date</th>
                        <th>Guide</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <AnimatePresence>
                    <tbody>
                        {bookings.map((b, idx) => (
                            <motion.tr
                                key={b._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="hover:bg-base-100/50"
                            >
                                <td>{idx + 1}</td>
                                <td className="font-medium">{b.packageName}</td>
                                <td>
                                    {new Date(b.tourDate.start).toLocaleDateString()} - {new Date(b.tourDate.end).toLocaleDateString()}
                                </td>
                                <td>{b.guideName || "Not Assigned"}</td>
                                <td>
                                    <span
                                        className={`badge ${b.payment_status === "paid"
                                            ? "badge-success"
                                            : "badge-error"
                                            }`}
                                    >
                                        {b.payment_status}
                                    </span>
                                </td>
                                
                                <td>${b.price}</td>
                                <td className="flex gap-2 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDelete(b._id)}
                                    >
                                        Delete
                                    </motion.button>

                                    {b.payment_status === "unpaid" && (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="btn btn-xs btn-primary"
                                            onClick={() =>
                                                handlePay(b._id)
                                                // console.log("Pay", b._id)
                                            }
                                        >
                                            Pay
                                        </motion.button>

                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="btn btn-xs btn-ghost border border-blue-300"
                                        onClick={() => setSelectedBooking(b)}
                                    >
                                        Details
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </AnimatePresence>
            </table>

            {/* 🟢 Details Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-base-100 dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold mb-4">
                                {selectedBooking.packageName}
                            </h3>
                            <p>
                                <span className="font-semibold">Tour Dates:</span>{" "}
                                {new Date(selectedBooking.tourDate.start).toLocaleDateString()} - {new Date(selectedBooking.tourDate.end).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">Guide:</span>{" "}
                                {selectedBooking.guideName || "Not Assigned"}
                            </p>
                            <p>
                                <span className="font-semibold">Guests:</span>{" "}
                                {selectedBooking.guests || 1}
                            </p>
                            <p>
                                <span className="font-semibold">Status:</span>{" "}
                                {selectedBooking.status}
                            </p>
                            <p>
                                <span className="font-semibold">Price:</span> $
                                {selectedBooking.price}
                            </p>

                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => handleDelete(selectedBooking._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => console.log("Pay", selectedBooking._id)}
                                >
                                    Pay
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setSelectedBooking(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyBookings;
