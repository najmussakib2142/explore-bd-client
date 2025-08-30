import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../shared/Loading/Loading";

const MyAssignedTours = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedTour, setSelectedTour] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ✅ React Query v5 syntax for fetching
  const {
    data: tours = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["assignedTours", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/assigned/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ React Query v5 syntax for mutation
  const mutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const res = await axiosSecure.patch(`/bookings/assigned/${id}/status`, { action });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignedTours"] });
      Swal.fire("Success", `Tour ${variables.action}ed successfully`, "success");
    },
    onError: () => {
      Swal.fire("Error", "Action failed", "error");
    },
  });

  const handleAction = (id, action) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this tour?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate({ id, action });
      }
    });
  };

  if (isLoading) return <Loading></Loading>;
  if (isError) return <p className="text-red-500">Failed to load tours.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto" data-aos="fade-up">
      <h2 className="text-2xl font-bold mb-6 text-center">My Assigned Tours</h2>

      {tours.length === 0 ? (
        <p className="text-center text-gray-500">No assigned tours yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full shadow-lg">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Package</th>
                <th>Tourist</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour, idx) => (
                <tr key={tour._id}>
                  <td>{idx + 1}</td>
                  <td>{tour.packageName}</td>
                  <td>{tour.touristName}</td>
                  {/* <td>
                    {tour.tourDate.start} → {tour.tourDate.end}
                  </td> */}
                  <td>
                    {
                      (() => {
                        const start = new Date(tour.tourDate.start)
                        const end = new Date(tour.tourDate.end);

                        const startFormatted = start.toLocaleDateString("en-GB");
                        const endFormatted = end.toLocaleDateString("en-GB");

                        if (
                          start.getMonth() === end.getMonth() &&
                          start.getFullYear() === end.getFullYear()
                        ) {
                          return `${start.getDate()} → ${endFormatted}`;
                        }
                        return `${startFormatted} → ${endFormatted}`;
                      })
                        ()}
                  </td>
                  <td>${tour.price}</td>
                  <td>
                    <span
                      className={`badge ${tour.booking_status === "accepted"
                        ? "badge-success"
                        : tour.booking_status === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                        }`}
                    >
                      {tour.booking_status}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleAction(tour._id, "accept")}
                      disabled={tour.booking_status !== "in-review" || mutation.isPending}
                      className="btn btn-sm btn-success"
                    >
                      {mutation.isPending ? "Processing..." : "Accept"}
                    </button>
                    <button
                      onClick={() => handleAction(tour._id, "reject")}
                      disabled={tour.booking_status !== "in-review" || mutation.isPending}
                      className="btn btn-sm btn-error"
                    >
                      {mutation.isPending ? "Processing..." : "Reject"}
                    </button>
                    <button
                      className="btn btn-xs btn-ghost border border-blue-300"
                      onClick={() => setSelectedTour(tour)}
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

      {/* Details modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg w-full shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-4">Tour Details</h3>

            <div className="space-y-3 text-sm">
              {/* Tourist Info */}
              <div className="flex items-center gap-3">
                {selectedTour.touristImage ? (
                  <img
                    src={selectedTour.touristImage}
                    alt={selectedTour.touristName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    👤
                  </div>
                )}
                <div>
                  <p className="font-semibold">{selectedTour.touristName}</p>
                  <p className="text-xs text-gray-500">{selectedTour.created_by}</p>
                </div>
              </div>

              {/* Package */}
              <p>
                <strong>Package:</strong> {selectedTour.packageName}
              </p>

              {/* Dates */}
              <p>
                <strong>Dates:</strong>{" "}
                {(() => {
                  const start = new Date(selectedTour.tourDate.start);
                  const end = new Date(selectedTour.tourDate.end);
                  if (
                    start.getMonth() === end.getMonth() &&
                    start.getFullYear() === end.getFullYear()
                  ) {
                    return `${start.getDate()} → ${end.toLocaleDateString("en-GB")}`;
                  }
                  return `${start.toLocaleDateString("en-GB")} → ${end.toLocaleDateString("en-GB")}`;
                })()}
              </p>

              {/* Members */}
              <p>
                <strong>Members:</strong> {selectedTour.members}
              </p>

              {/* Price */}
              <p>
                <strong>Price:</strong> ${selectedTour.price}
              </p>

              {/* Payment Info */}
              <p>
                <strong>Payment:</strong> {selectedTour.payment_status} (
                {selectedTour.payment?.method?.join(", ")})
              </p>
              {selectedTour.payment?.transactionId && (
                <p>
                  <strong>Txn ID:</strong> {selectedTour.payment.transactionId}
                </p>
              )}

              {/* Status */}
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{selectedTour.booking_status}</span>
              </p>

              {/* Tracking ID */}
              <p>
                <strong>Tracking ID:</strong> {selectedTour.tracking_id}
              </p>

              {/* Assigned Info */}
              <p>
                <strong>Assigned At:</strong>{" "}
                {new Date(selectedTour.assignedAt).toLocaleString()}
              </p>
              <p>
                <strong>Assigned By:</strong> {selectedTour.assignedBy}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedTour(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default MyAssignedTours;
