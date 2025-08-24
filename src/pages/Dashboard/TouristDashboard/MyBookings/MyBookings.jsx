import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";

const MyBookings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ Fetch bookings for logged in user
  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ Handle cancel
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axiosSecure.delete(`/bookings/${id}`);
      refetch();
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  // ✅ Handle pay
  const handlePay = (packageId, bookingId) => {
    navigate(`/dashboard/payment/${packageId}/${bookingId}`);
  };

  if (isLoading) return <p className="text-center">Loading bookings...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>

      {/* Table */}
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
                    className={`badge ${
                      b.status === "accepted"
                        ? "badge-success"
                        : b.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>${b.price}</td>
                <td className="flex gap-2">
                  {/* Cancel when status = pending */}
                  {b.status === "pending" && (
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
                  {b.status === "pending" && b.payment_status === "unpaid" && (
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

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <p>
              <strong>Package:</strong> {selectedBooking.packageName}
            </p>
            <p>
              <strong>Guide:</strong> {selectedBooking.guideName}
            </p>
            <p>
              <strong>Tour Date:</strong> {selectedBooking.tourDate?.start} →{" "}
              {selectedBooking.tourDate?.end}
            </p>
            <p>
              <strong>Payment Status:</strong> {selectedBooking.payment_status}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>Price:</strong> ${selectedBooking.price}
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
      )}
    </div>
  );
};

export default MyBookings;
