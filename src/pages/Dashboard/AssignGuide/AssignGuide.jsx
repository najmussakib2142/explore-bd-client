import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../shared/Loading/Loading";

const AssignGuide = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Initialize AOS
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Fetch bookings
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["adminBookings"],
        queryFn: async () => {
            const res = await axiosSecure.get("/bookings/admin"); // backend API filters paid & pending
            return res.data;
        },
    });

    // Approve mutation
    const approveMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/bookings/approve/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminBookings"]);
            Swal.fire("Success!", "Booking approved and guide assigned.", "success");
        },
        onError: () => {
            Swal.fire("Error!", "Failed to approve booking.", "error");
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/bookings/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["adminBookings"]);
            Swal.fire("Deleted!", "Booking has been deleted.", "success");
        },
        onError: () => {
            Swal.fire("Error!", "Failed to delete booking.", "error");
        },
    });

    if (isLoading) return <Loading></Loading>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Assign Guide</h2>

            {bookings.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No pending bookings</p>
            ) : (
                <div className="overflow-x-auto" data-aos="fade-up">
                    <table className="table w-full shadow-lg rounded-lg">
                        <thead className="bg-base-100">
                            <tr>
                                <th>#</th>
                                <th>Package</th>
                                <th>Tourist</th>
                                <th>Guide</th>
                                <th>Tour Date</th>
                                <th>Members</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b, idx) => (
                                <tr key={b._id} data-aos="fade-up" data-aos-delay={idx * 50}>
                                    <td>{idx + 1}</td>
                                    <td>{b.packageName}</td>
                                    <td>{b.touristName}</td>
                                    <td>{b.guideName}</td>
                                    <td>
                                        {b.tourDate?.start} → {b.tourDate?.end}
                                    </td>
                                    <td>{b.members}</td>
                                    <td>
                                        <span
                                            className={`badge ${b.booking_status === "guide_assigned"
                                                ? "badge-success"
                                                : "badge-warning"
                                                }`}
                                        >
                                            {b.booking_status}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => approveMutation.mutate(b._id)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => deleteMutation.mutate(b._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-xs btn-ghost border border-gray-300"
                                            onClick={() => setSelectedBooking(b)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {/* {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50">
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h3 className="text-xl font-bold mb-4">Booking Details</h3>
                        <p>
                            <strong>Package:</strong> {selectedBooking.packageName}
                        </p>
                        <p>
                            <strong>Tourist:</strong> {selectedBooking.touristName}
                        </p>
                        <p>
                            <strong>Guide:</strong> {selectedBooking.guideName}
                        </p>
                        <p>
                            <strong>Tour Date:</strong> {selectedBooking.tourDate?.start} →{" "}
                            {selectedBooking.tourDate?.end}
                        </p>
                        <p>
                            <strong>Members:</strong> {selectedBooking.members}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedBooking.booking_status}
                        </p>
                        <p>
                            <strong>Payment Status:</strong> {selectedBooking.payment_status}
                        </p>
                        <p>
                            <strong>Transaction ID:</strong> {selectedBooking.payment.transactionId}
                        </p>
                        <p>
                            <strong>Payment Status:</strong> {selectedBooking.payment?.paid_at
                                ? new Date(selectedBooking.payment.paid_at).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "Unpaid"}
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setSelectedBooking(null)}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )} */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50">
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h3 className="text-2xl font-bold mb-4">Booking Details</h3>

                        {/* Package & Tourist Info */}
                        <div className="space-y-2">
                            <p>
                                <strong>Package:</strong> {selectedBooking.packageName}
                            </p>
                            <p>
                                <strong>Tourist:</strong> {selectedBooking.touristName}
                                {selectedBooking.touristImage && (
                                    <img
                                        src={selectedBooking.touristImage}
                                        alt={selectedBooking.touristName}
                                        className="inline-block w-10 h-10 rounded-full ml-2"
                                    />
                                )}
                            </p>
                            <p>
                                <strong>Guide:</strong>{" "}
                                {selectedBooking.guideName ? selectedBooking.guideName : "Not Assigned"}
                            </p>
                        </div>

                        {/* Tour Info */}
                        <div className="mt-4 space-y-2">
                            <p>
                                <strong>Tour Dates:</strong> {selectedBooking.tourDate?.start} →{" "}
                                {selectedBooking.tourDate?.end}
                            </p>
                            <p>
                                <strong>Members:</strong> {selectedBooking.members}
                            </p>
                            <p>
                                <strong>Tracking ID:</strong> {selectedBooking.tracking_id}
                            </p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`px-2 py-1 rounded ${selectedBooking.booking_status === "guide_assigned"
                                            ? "bg-blue-100 text-blue-800"
                                            : selectedBooking.booking_status === "accepted"
                                                ? "bg-green-100 text-green-800"
                                                : selectedBooking.booking_status === "rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {selectedBooking.booking_status}
                                </span>
                            </p>
                        </div>

                        {/* Payment Info */}
                        <div className="mt-4 space-y-2 border-t pt-3">
                            <p>
                                <strong>Price:</strong> ${selectedBooking.price}
                            </p>
                            <p>
                                <strong>Payment Status:</strong> {selectedBooking.payment_status}
                            </p>
                            <p>
                                <strong>Transaction ID:</strong>{" "}
                                {selectedBooking.payment?.transactionId || "N/A"}
                            </p>
                            <p>
                                <strong>Paid At:</strong>{" "}
                                {selectedBooking.payment?.paid_at
                                    ? new Date(selectedBooking.payment.paid_at).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "Unpaid"}
                            </p>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setSelectedBooking(null)}
                            >
                                Close
                            </button>
                            {/* Example admin actions */}
                            <button className="btn btn-sm btn-success">Approve</button>
                            <button className="btn btn-sm btn-error">Reject</button>
                        </div>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default AssignGuide;
