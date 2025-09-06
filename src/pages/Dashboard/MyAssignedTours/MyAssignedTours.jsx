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
  const [pendingTourId, setPendingTourId] = useState(null);

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
      if (!user?.email) return { assignedTours: [] }; // prevent bad request
      const res = await axiosSecure.get(`/bookings/assigned/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const toursArray = Array.isArray(tours.assignedTours) ? tours.assignedTours : [];
  console.log(toursArray);
  console.log(tours.assignedTours);

  // ✅ React Query v5 syntax for mutation
  const mutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const res = await axiosSecure.patch(`/bookings/assigned/${id}/status`, { action });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assignedTours", user?.email] });
      Swal.fire("Success", `Tour ${variables.action === "accept" ? "Accepted" : "Rejected"} successfully`, "success");
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
        setPendingTourId(id); // set the specific tour as pending
        mutation.mutate({ id, action }, {
          onSettled: () => setPendingTourId(null), // reset after success/error
        });
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTours = toursArray.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(toursArray.length / itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };


  if (isLoading) return <Loading></Loading>;
  if (isError) return <p className="text-red-500">Failed to load tours.</p>;

  return (
    <>
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
                {currentTours.map((tour, idx) => (
                  <tr key={tour._id} className="align-top">
                    <td className="whitespace-nowrap">{idx + 1}</td>

                    {/* Package Name */}
                    <td className="max-w-[200px] truncate" title={tour.packageName}>
                      {tour.packageName}
                    </td>

                    {/* Tourist Name */}
                    <td className="max-w-[150px] truncate" title={tour.touristName}>
                      {tour.touristName}
                    </td>

                    {/* Dates */}
                    <td className="whitespace-nowrap">
                      {(() => {
                        const parseDMY = (str) => {
                          const [day, month, year] = str.split("/").map(Number);
                          const fullYear = year < 100 ? 2000 + year : year;
                          return new Date(fullYear, month - 1, day);
                        };

                        const start = parseDMY(tour.tourDate.start);
                        const end = parseDMY(tour.tourDate.end);

                        const startFormatted = start.toLocaleDateString("en-GB");
                        const endFormatted = end.toLocaleDateString("en-GB");

                        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                          return `${start.getDate()} → ${endFormatted}`;
                        }
                        return `${startFormatted} → ${endFormatted}`;
                      })()}
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap">${tour.price}</td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`badge px-3 py-1 whitespace-nowrap ${tour.booking_status === "accepted"
                          ? "badge-success"
                          : tour.booking_status === "rejected"
                            ? "badge-error"
                            : tour.booking_status === "in-review"
                              ? "badge-info"
                              : "badge-warning"
                          }`}
                      >
                        {tour.booking_status === "in-review"
                          ? "In Review"
                          : tour.booking_status.charAt(0).toUpperCase() + tour.booking_status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="flex gap-2 overflow-x-auto">
                      <button
                        onClick={() => handleAction(tour._id, "accept")}
                        disabled={tour.booking_status !== "in-review" || pendingTourId === tour._id}
                        className={`btn btn-xs btn-success whitespace-nowrap ${pendingTourId === tour._id ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {pendingTourId === tour._id ? "Processing..." : "Accept"}
                      </button>

                      <button
                        onClick={() => handleAction(tour._id, "reject")}
                        disabled={tour.booking_status !== "in-review" || pendingTourId === tour._id}
                        className={`btn btn-xs btn-error whitespace-nowrap ${pendingTourId === tour._id ? "opacity-70 cursor-not-allowed" : ""}`}
                      >
                        {pendingTourId === tour._id ? "Processing..." : "Reject"}
                      </button>


                      <button
                        className="btn btn-xs btn-ghost border border-blue-300 whitespace-nowrap"
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



      </div>
      {/* Details modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            {/* Title */}
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
              Tour Details
            </h3>

            <div className="space-y-4 text-sm">
              {/* Tourist Info */}
              <div className="flex items-center gap-3 border-b pb-3">
                {selectedTour.touristImage ? (
                  <img
                    src={selectedTour.touristImage}
                    alt={selectedTour.touristName}
                    className="w-14 h-14 rounded-full object-cover shadow"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                    👤
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{selectedTour.touristName}</p>
                  <p className="text-xs text-gray-500">{selectedTour.created_by}</p>
                </div>
              </div>

              {/* Package */}
              <div>
                <p className="font-medium">
                  <span className="text-gray-500">Package:</span>{" "}
                  {selectedTour.packageName}
                </p>
              </div>

              {/* Dates */}
              <div>
                <p className="font-medium">
                  <span className="text-gray-500">Dates:</span>{" "}
                  {(() => {
                    // Helper to parse DD/MM/YY
                    const parseDMY = (str) => {
                      const [day, month, year] = str.split("/").map(Number);
                      const fullYear = year < 100 ? 2000 + year : year;
                      return new Date(fullYear, month - 1, day);
                    };

                    const start = parseDMY(selectedTour.tourDate.start);
                    const end = parseDMY(selectedTour.tourDate.end);

                    // Format dates
                    const startFormatted = start.toLocaleDateString("en-GB");
                    const endFormatted = end.toLocaleDateString("en-GB");

                    // If same month & year, show just start day → end full date
                    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
                      return `${start.getDate()} → ${endFormatted}`;
                    }

                    return `${startFormatted} → ${endFormatted}`;
                  })()}
                </p>



              </div>
              <p>
                <span className="text-gray-500">Created At:</span>{" "}
                <strong>
                  {selectedTour.created_at
                    ? new Date(selectedTour.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      // hour: "2-digit",
                      // minute: "2-digit",
                    })
                    : "N/A"}
                </strong>
              </p>
              {/* Members & Price */}
              <div className="grid grid-cols-2 gap-3">
                <p>
                  <span className="text-gray-500">Members:</span>{" "}
                  <strong>{selectedTour.members}</strong>
                </p>
                <p>
                  <span className="text-gray-500">Price:</span>{" "}
                  <span className="text-green-600 font-semibold">
                    ${selectedTour.price}
                  </span>
                </p>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-3 space-y-1">
                <p>
                  <span className="text-gray-500">Payment:</span>{" "}
                  {selectedTour.payment_status}{" "}
                  {selectedTour.payment?.method && (
                    <span className="text-xs text-gray-400">
                      ({selectedTour.payment.method.join(", ")})
                    </span>
                  )}
                </p>

                {selectedTour.payment?.paid_at && (
                  <p>
                    <span className="text-gray-500">Paid At:</span>{" "}
                    <strong>
                      {new Date(selectedTour.payment.paid_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        // hour: "2-digit",
                        // minute: "2-digit",
                      })}
                    </strong>
                  </p>
                )}

                {selectedTour.payment?.transactionId && (
                  <p>
                    <span className="text-gray-500">Txn ID:</span>{" "}
                    {selectedTour.payment.transactionId}
                  </p>
                )}

              </div>

              {/* Status & Tracking */}
              <div className="grid grid-cols-2 gap-3">
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${selectedTour.booking_status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : selectedTour.booking_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {selectedTour.booking_status}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Tracking ID:</span>{" "}
                  {selectedTour.tracking_id}
                </p>
              </div>

              {/* Assigned Info */}
              {/* <div className="border-t pt-3 space-y-1 text-xs text-gray-500">
                <p>
                  <strong>Assigned At:</strong>{" "}
                  {new Date(selectedTour.assignedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Assigned By:</strong> {selectedTour.assignedBy}
                </p>
              </div> */}
            </div>

            {/* Footer */}
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

      <div className="pagination mt-6 flex justify-center items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)} // 1-indexed page
            className={`px-3 py-1 rounded ${currentPage === i + 1
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        >
          Next
        </button>

        <select
          value={itemsPerPage}
          onChange={handleItemsPerPage}
          className="ml-3 cursor-pointer border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
     
    </>
  );
};

export default MyAssignedTours;
