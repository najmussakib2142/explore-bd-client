import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../shared/Loading/Loading";
import Swal from "sweetalert2";

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


  // ✅ Handle pay
  const handlePay = (packageId, bookingId) => {
    navigate(`/dashboard/payment/${packageId}/${bookingId}`);
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <div className="p-6">
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
                        className={`badge ${b.status === "accepted"
                          ? "badge-success"
                          : b.status === "rejected"
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white space-y-1 dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-4">Booking Details</h3>
            <p >
              <strong>Package:</strong> {selectedBooking.packageName}
            </p>
            <p>
              <strong>Transaction Id:</strong> {selectedBooking.payment.transactionId}
            </p>
            <p>
              <strong>Transaction Id:</strong> {selectedBooking.tracking_id}
            </p>
            <p>
              <strong>Guide:</strong> {selectedBooking.guideName}
            </p>
            <p>
              <strong>Tour Date:</strong> {selectedBooking.tourDate?.start} →{" "}
              {selectedBooking.tourDate?.end}
            </p>
            <p>
              <strong>Admin Approval:</strong> {selectedBooking.booking_status}
            </p>
            <p>
              <strong>Payment Status:</strong> {selectedBooking.payment_status}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedBooking.price}
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
