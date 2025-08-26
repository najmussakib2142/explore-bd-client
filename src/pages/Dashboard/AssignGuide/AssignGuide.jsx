// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import Swal from "sweetalert2";
// import useAxios from "../../../hooks/useAxios";

// const AssignGuide = () => {
//     const [selectedBooking, setSelectedBooking] = useState(null);
//     const [availableGuides, setAvailableGuides] = useState([]);
//     const queryClient = useQueryClient();
//     const axiosInstance = useAxios();

//     // Fetch bookings that are paid but pending guide assignment
//     const { data: bookings = [], isLoading } = useQuery({
//         queryKey: ["assignableBookings"],
//         queryFn: async () => {
//             const res = await axiosInstance.get(
//                 "/bookings?payment_status=paid&status=pending"
//             );
//             return res.data.sort(
//                 (a, b) => new Date(a.created_at) - new Date(b.created_at)
//             );
//         },
//     });

//     // Mutation to assign guide
//     const { mutateAsync: assignGuide } = useMutation({
//         mutationFn: async ({ bookingId, guide }) => {
//             const res = await axiosInstance.patch(`/bookings/${bookingId}/assign`, {
//                 guideId: guide._id,
//                 guideEmail: guide.email,
//                 guideName: guide.name,
//                 status: "waiting for guide confirmation",
//             });
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries(["assignableBookings"]);
//             Swal.fire("Success", "Guide assigned successfully!", "success");
//         },
//         onError: () => {
//             Swal.fire("Error", "Failed to assign guide", "error");
//         },
//     });

//     const openDetailsModal = async (booking) => {
//         setSelectedBooking(booking);
//         try {
//             const res = await axiosInstance.get("/guides/available", {
//                 params: { district: booking.district || "Dhaka" },
//             });
//             setAvailableGuides(res.data);
//         } catch (error) {
//             console.error("Error fetching guides", error);
//             Swal.fire("Error", "Failed to load guides", "error");
//         } finally {
//             document.getElementById("detailsModal").showModal();
//         }
//     };

//     const handleAssign = (booking, guide) => {
//         assignGuide({ bookingId: booking._id, guide });
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4">Bookings Pending Guide Assignment</h2>

//             {isLoading ? (
//                 <p>Loading bookings...</p>
//             ) : bookings.length === 0 ? (
//                 <p className="text-gray-500">No bookings available.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="table w-full">
//                         <thead>
//                             <tr>
//                                 <th>Tourist</th>
//                                 <th>Package</th>
//                                 <th>Guide</th>
//                                 <th>Location</th>
//                                 <th>Tour Date</th>
//                                 <th>Members</th>
//                                 <th>Payment</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bookings.map((booking) => (
//                                 <tr key={booking._id}>
//                                     <td>{booking.touristName}</td>
//                                     <td>{booking.packageName}</td>
//                                     <td>{booking.guideName || "-"}</td>
//                                     <td>{booking.location}</td>
//                                     <td>
//                                         {new Date(booking.tourDate.start).toLocaleDateString()} -{" "}
//                                         {new Date(booking.tourDate.end).toLocaleDateString()}
//                                     </td>
//                                     <td>{booking.totalMembers}</td>
//                                     <td>{booking.payment_status}</td>
//                                     <td className="flex gap-2">
//                                         <button
//                                             onClick={() => openDetailsModal(booking)}
//                                             className="btn btn-sm btn-info"
//                                         >
//                                             Details
//                                         </button>
//                                         <button
//                                             className="btn btn-sm btn-success"
//                                             onClick={() =>
//                                                 handleAssign(booking, availableGuides[0]) // assign first available guide
//                                             }
//                                         >
//                                             Assign Guide
//                                         </button>
//                                         {/* {availableGuides.length > 0 && (

//                                         )} */}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {/* Details Modal */}
//                     <dialog id="detailsModal" className="modal">
//                         <div className="modal-box max-w-2xl p-6 space-y-4 animate-slide-in">
//                             <h3 className="text-lg font-bold mb-2">
//                                 Booking Details:{" "}
//                                 <span className="text-primary">{selectedBooking?.packageName}</span>
//                             </h3>

//                             {selectedBooking && (
//                                 <div className="space-y-2">
//                                     <p><strong>Tourist:</strong> {selectedBooking.touristName}</p>
//                                     <p><strong>Package:</strong> {selectedBooking.packageName}</p>
//                                     <p><strong>Location:</strong> {selectedBooking.location}</p>
//                                     <p><strong>Tour Date:</strong> {new Date(selectedBooking.tourDate.start).toLocaleDateString()} - {new Date(selectedBooking.tourDate.end).toLocaleDateString()}</p>
//                                     <p><strong>Members:</strong> {selectedBooking.totalMembers}</p>
//                                     <p><strong>Payment Status:</strong> {selectedBooking.payment_status}</p>
//                                 </div>
//                             )}

//                             <div className="modal-action">
//                                 <form method="dialog">
//                                     <button className="btn btn-outline">Close</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </dialog>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AssignGuide;


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";

const AssignGuide = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const queryClient = useQueryClient();
    const axiosInstance = useAxios();

    // ✅ Fetch bookings that are pending
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["assignableBookings"],
        queryFn: async () => {
            const res = await axiosInstance.get("/bookings?payment_status=paid&status=pending");
            return res.data.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        },
    });

    // ✅ Mutation to assign guide (tourist already selected guide)
    const { mutateAsync: assignGuide } = useMutation({
        mutationFn: async ({ bookingId, guide }) => {
            const res = await axiosInstance.patch(`/bookings/${bookingId}/assign`, {
                guideId: guide._id,
                guideEmail: guide.email,
                guideName: guide.name,
                status: "waiting for guide confirmation",
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["assignableBookings"]);
            Swal.fire("✅ Success", "Guide assigned successfully!", "success");
        },
        onError: () => {
            Swal.fire("❌ Error", "Failed to assign guide", "error");
        },
    });

    // ✅ Assign handler (no dropdown, no validation)
    const handleAssign = async (booking) => {
        if (booking.payment_status !== "paid") {
            Swal.fire("❌ Payment Pending", "Cannot assign guide until payment is completed", "error");
            return;
        }

        // tourist already selected guide (info is inside booking)
        const guide = {
            _id: booking.guideId,
            email: booking.guideEmail,
            name: booking.guideName,
        };

        if (!guide._id || !guide.email) {
            Swal.fire("❌ No Guide Info", "This booking has no guide selected by the tourist", "error");
            return;
        }

        await assignGuide({ bookingId: booking._id, guide });
    };

    // ✅ Details modal
    const openDetailsModal = (booking) => {
        setSelectedBooking(booking);
        document.getElementById("detailsModal").showModal();
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
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Tourist</th>
                                <th>Package</th>
                                <th>Guide (selected by tourist)</th>
                                <th>Tour Date</th>
                                <th>Members</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.touristName}</td>
                                    <td>{booking.packageName}</td>
                                    <td>{booking.guideName || "-"}</td>
                                    <td>
                                        {new Date(booking.tourDate.start).toLocaleDateString()} -{" "}
                                        {new Date(booking.tourDate.end).toLocaleDateString()}
                                    </td>
                                    <td>{booking.totalMembers}</td>
                                    <td>
                                        <span
                                            className={`badge ${booking.payment_status === "paid"
                                                    ? "badge-success"
                                                    : "badge-error"
                                                }`}
                                        >
                                            {booking.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${booking.status === "pending"
                                                    ? "badge-warning"
                                                    : "badge-success"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => openDetailsModal(booking)}
                                            className="btn btn-sm btn-info"
                                        >
                                            Details
                                        </button>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleAssign(booking)}
                                            disabled={booking.status !== "pending"}
                                        >
                                            Assign Guide
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Details Modal */}
                    <dialog id="detailsModal" className="modal">
                        <div className="modal-box max-w-2xl p-6 space-y-4 animate-slide-in">
                            <h3 className="text-lg font-bold mb-2">
                                Booking Details:{" "}
                                <span className="text-primary">
                                    {selectedBooking?.packageName}
                                </span>
                            </h3>

                            {selectedBooking && (
                                <div className="space-y-2">
                                    <p>
                                        <strong>Tourist:</strong> {selectedBooking.touristName}
                                    </p>
                                    <p>
                                        <strong>Guide:</strong> {selectedBooking.guideName}
                                    </p>
                                    <p>
                                        <strong>Tour Date:</strong>{" "}
                                        {new Date(
                                            selectedBooking.tourDate.start
                                        ).toLocaleDateString()}{" "}
                                        -{" "}
                                        {new Date(
                                            selectedBooking.tourDate.end
                                        ).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Members:</strong> {selectedBooking.totalMembers}
                                    </p>
                                    <p>
                                        <strong>Payment Status:</strong>{" "}
                                        {selectedBooking.payment_status}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {selectedBooking.status}
                                    </p>
                                </div>
                            )}

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
