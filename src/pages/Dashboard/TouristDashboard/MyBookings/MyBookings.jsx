import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../shared/Loading/Loading";

const MyBookings = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user?.uid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bookings/user/${user.uid}`);
      return res.data;
    },
    enabled: !!user,
  });

  if (isLoading) return <Loading />;

  if (bookings.length === 0)
    return <p className="p-6">You have no bookings yet.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border border-base-300 rounded-lg">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Package</th>
              <th>Date</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr key={b._id} className="hover">
                <td>{index + 1}</td>
                <td className="font-medium">{b.packageName}</td>
                <td>{new Date(b.date).toLocaleDateString()}</td>
                <td>{b.guests}</td>
                <td>
                  <span
                    className={`font-semibold px-2 py-1 rounded text-sm ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="flex gap-2">
                  {/* Pay Button */}
                  {b.status === "pending" && (
                    <button className="btn btn-xs btn-success">Pay</button>
                  )}

                  {/* Delete Button */}
                  <button className="btn btn-xs btn-error">Delete</button>

                  {/* View/Details Button */}
                  <button className="btn btn-xs btn-info">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
