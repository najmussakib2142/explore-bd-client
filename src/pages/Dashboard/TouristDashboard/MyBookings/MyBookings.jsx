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

    if (bookings.length === 0) return <p className="p-6">You have no bookings yet.</p>;

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
                <div key={b._id} className="bg-base-100 shadow-md rounded-lg p-4">
                    <h3 className="text-lg font-semibold">{b.packageName}</h3>
                    <p>Date: {new Date(b.date).toLocaleDateString()}</p>
                    <p>Guests: {b.guests}</p>
                    <p>Status: <span className={`font-semibold ${b.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>{b.status}</span></p>
                </div>
            ))}
        </div>
    );
};

export default MyBookings;
