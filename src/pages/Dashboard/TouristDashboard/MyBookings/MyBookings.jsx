import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../shared/Loading/Loading";
import Swal from "sweetalert2";
import Confetti from "react-confetti";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCongrats, setShowCongrats] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ Fetch bookings for logged in user
  const { data, refetch, isLoading } = useQuery({
  queryKey: ["bookings", user?.email, currentPage, itemsPerPage],
  queryFn: async () => {
    const res = await axiosSecure.get(
      `/bookings?email=${user?.email}&page=${currentPage}&limit=${itemsPerPage}`
    );
    return res.data;
  },
  enabled: !!user?.email,
});
  console.log("data:", JSON.stringify(data, null, 2));

  const bookings = useMemo(() => data?.bookings || [], [data?.bookings]);
  const totalPages = data?.totalPages || 0;

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleItemsPerPage = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(0); // reset to first page
  };

  // ✅ Handle cancel

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This booking will be cancelled and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/bookings/${id}`);
          refetch();

          Swal.fire({
            title: "Cancelled!",
            text: "Your booking has been cancelled successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Cancel failed:", error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while cancelling.",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    if (bookings.length >= 3) {
      setShowCongrats(true);
      const timer = setTimeout(() => setShowCongrats(false), 7000); // hide after 8s for more effect
      return () => clearTimeout(timer);
    }
  }, [bookings]);


  // ✅ Handle pay
  const handlePay = (packageId, bookingId) => {
    navigate(`/dashboard/payment/${packageId}/${bookingId}`);
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="p-6">


      {showCongrats && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={600}
            recycle={false}
          />

          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center max-w-lg mx-4"
          >
            <h1 className="text-4xl font-bold text-yellow-500 mb-2 animate-bounce">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
              You’ve successfully booked <span className="font-semibold">{bookings.length}</span> amazing trips! ✨
            </p>
            <button
              onClick={() => setShowCongrats(false)}
              className="mt-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md transition-all duration-300"
            >
              Awesome!
            </button>
          </motion.div>
        </div>
      )}


      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>

      {/* Table */}

      {bookings.length === 0 ? (
        (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
              alt="No Bookings"
              className="w-32 mb-4 opacity-80"
            />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <Link to={"/allTrips"} className="btn hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 text-primary bg-base-100 ">Start exploring and book your next adventure!</Link>
          </div>
        )
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full shadow-xl">
              <thead className="bg-base-100 ">
                <tr>
                  <th>#</th>
                  <th>Package</th>
                  <th>Guide</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={b._id}>
                    <td>{idx + 1}</td>
                    <td>{b.packageName}</td>
                    <td>{b.guideName}</td>
                    <td>
                      {b.tourDate?.start} → {b.tourDate?.end}
                    </td>
                    <td>
                      <span
                        className={`badge ${b.booking_status === "accepted"
                          ? "badge-success"
                          : b.booking_status === "rejected"
                            ? "badge-error"
                            : "badge-warning"
                          }`}
                      >
                        {b.booking_status}
                      </span>
                    </td>
                    <td>${b.price}</td>
                    <td className="flex gap-2">
                      {/* Cancel when status = pending */}
                      {b.booking_status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-xs btn-error"
                          onClick={() => handleDelete(b._id)}
                        >
                          Cancel
                        </motion.button>
                      )}

                      {/* Pay when status = pending & unpaid */}
                      {b.payment_status === "unpaid" && b.payment_status === "unpaid" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-xs btn-primary"
                          onClick={() => handlePay(b.packageId, b._id)}
                        >
                          Pay
                        </motion.button>
                      )}

                      {/* Details always */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn border-blue-300 btn-xs btn-ghost border"
                        onClick={() => setSelectedBooking(b)}
                      >
                        Details
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}



      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
            >
              ✕
            </button>

            {/* Header */}
            <h3 className="text-2xl font-bold mb-4 text-center text-primary">
              Booking Details
            </h3>

            {/* Package Info */}
            <div className="space-y-3 text-sm">
              <p>
                <strong className="text-secondary">📦 Package:</strong>{" "}
                {selectedBooking.packageName}
              </p>
              <p>
                <strong className="text-secondary">🧾 Transaction ID:</strong>{" "}
                <span className="font-mono">{selectedBooking.payment.transactionId}</span>
              </p>
              <p>
                <strong className="text-secondary">🎟️ Tracking ID:</strong>{" "}
                <span className="font-mono">{selectedBooking.tracking_id}</span>
              </p>
              <p>
                <strong className="text-secondary">🧑 Guide:</strong>{" "}
                {selectedBooking.guideName}
              </p>
              <p>
                <strong className="text-secondary">📅 Tour Date:</strong>{" "}
                {selectedBooking.tourDate?.start} → {selectedBooking.tourDate?.end}
              </p>

              {/* Status Badges */}
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedBooking.booking_status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {selectedBooking.booking_status}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedBooking.payment_status === "paid"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {selectedBooking.payment_status}
                </span>
              </div>

              <p className="mt-2">
                <strong className="text-secondary">💰 Amount:</strong> ৳
                {selectedBooking.price}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 🔹 Pagination Controls */}
      {bookings.length > 0 && (
        <div className="pagination mt-6 flex justify-center items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 rounded ${currentPage === i
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>

          <select
            value={itemsPerPage}
            onChange={handleItemsPerPage}
            className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
          </select>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
