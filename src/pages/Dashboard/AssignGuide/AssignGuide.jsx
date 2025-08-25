import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";

const AssignGuide = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [availableGuides, setAvailableGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState("");
    const [loadingGuides, setLoadingGuides] = useState(false);
    const queryClient = useQueryClient();
    const axiosInstance = useAxios();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["assignableBookings"],
        queryFn: async () => {
            const res = await axiosInstance.get(
                "/bookings?payment_status=paid&status=pending"
            );
            return res.data.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        },
    });

    const { mutateAsync: assignGuide } = useMutation({
        mutationFn: async ({ bookingId, guide }) => {
            const res = await axiosInstance.patch(`/bookings/${bookingId}/assign`, {
                guideId: guide._id,
                guideEmail: guide.email,
                guideName: guide.name,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["assignableBookings"]);
            Swal.fire("Success", "Guide assigned successfully!", "success");
            document.getElementById("detailsModal").close();
            setSelectedGuide("");
        },
        onError: () => {
            Swal.fire("Error", "Failed to assign guide", "error");
        },
    });

    const openDetailsModal = async (booking) => {
        setSelectedBooking(booking);
        setLoadingGuides(true);
        setAvailableGuides([]);
        setSelectedGuide("");

        try {
            const res = await axiosInstance.get("/guides/available", {
                params: { district: booking.district || "Dhaka" },
            });
            setAvailableGuides(res.data);
        } catch (error) {
            console.error("Error fetching guides", error);
            Swal.fire("Error", "Failed to load guides", "error");
        } finally {
            setLoadingGuides(false);
            document.getElementById("detailsModal").showModal();
        }
    };

    const handleAssign = () => {
        if (!selectedGuide) return Swal.fire("Error", "Select a guide first", "warning");

        const guide = availableGuides.find((g) => g._id === selectedGuide);
        assignGuide({ bookingId: selectedBooking._id, guide });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Bookings Pending Guide Assignment</h2>

            {isLoading ? (
                <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <p className="text-gray-500">No bookings available.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table  w-full">
                        <thead>
                            <tr>
                                <th>Tourist</th>
                                <th>Package</th>
                                <th>Guide Name</th>
                                <th>Location</th>
                                <th>Tour Date</th>
                                <th>Members</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.touristName}</td>
                                    <td>{booking.packageName}</td>
                                    <td>{booking.guideName || "-"}</td>
                                    <td>{booking.location}</td>
                                    <td>
                                        {new Date(booking.tourDate.start).toLocaleDateString()} -{" "}
                                        {new Date(booking.tourDate.end).toLocaleDateString()}
                                    </td>
                                    <td>{booking.totalMembers}</td>
                                    <td>{booking.payment_status}</td>
                                    <div>
                                        <td className="flex gap-2">
                                            <button
                                                onClick={() => openDetailsModal(booking)}
                                                className="btn btn-sm btn-info"
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={handleAssign}
                                                disabled={!selectedGuide}
                                            >
                                                Assign Guide
                                            </button>
                                        </td>

                                    </div>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Details & Assign Modal */}
                    <dialog id="detailsModal" className="modal">
                        <div className="modal-box max-w-2xl p-6 space-y-4 animate-slide-in">
                            <h3 className="text-lg font-bold mb-2">
                                Booking Details:{" "}
                                <span className="text-primary">{selectedBooking?.packageName}</span>
                            </h3>

                            {selectedBooking && (
                                <div className="space-y-2">
                                    <p><strong>Tourist:</strong> {selectedBooking.touristName}</p>
                                    <p><strong>Package:</strong> {selectedBooking.packageName}</p>
                                    <p><strong>Location:</strong> {selectedBooking.location}</p>
                                    <p><strong>Tour Date:</strong> {new Date(selectedBooking.tourDate.start).toLocaleDateString()} - {new Date(selectedBooking.tourDate.end).toLocaleDateString()}</p>
                                    <p><strong>Members:</strong> {selectedBooking.totalMembers}</p>
                                    <p><strong>Payment Status:</strong> {selectedBooking.payment_status}</p>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="block font-semibold mb-1">Select Guide</label>
                                {loadingGuides ? (
                                    <p>Loading guides...</p>
                                ) : availableGuides.length === 0 ? (
                                    <p className="text-error">No available guides in this district.</p>
                                ) : (
                                    <select
                                        className="select select-bordered w-full"
                                        value={selectedGuide}
                                        onChange={(e) => setSelectedGuide(e.target.value)}
                                    >
                                        <option value="">Select Guide</option>
                                        {availableGuides.map((guide) => (
                                            <option key={guide._id} value={guide._id}>
                                                {guide.name} ({guide.experience} yrs)
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="modal-action">

                                <form method="dialog">
                                    <button className="btn btn-outline">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
            )}
        </div>
    );
};

export default AssignGuide;
