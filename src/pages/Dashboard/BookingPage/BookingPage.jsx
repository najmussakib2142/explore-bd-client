// import React, { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import Confetti from "react-confetti";
// import useAxios from "../../../hooks/useAxios";
// import useAuth from "../../../hooks/useAuth";
// import { useLocation } from "react-router";

// const BookingPage = () => {
//     const { user } = useAuth();
//     const axiosInstance = useAxios()
//     const location = useLocation();

//     // const queryClient = useQueryClient();
//     const [showCongrats, setShowCongrats] = useState(false);
//     const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

//     // Update window size for confetti
//     useEffect(() => {
//         setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//         const handleResize = () =>
//             setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Fetch bookings
//     const { data: bookings = [] } = useQuery({
//         queryKey: ["bookings", user?.uid],
//         queryFn: async () => {
//             if (!user) return [];
//             const res = await axiosInstance.get(`/bookings/user/${user.uid}`);
//             return res.data; // bookings array from backend
//         },
//         enabled: !!user,
//     });

//     console.log("Bookings response:", bookings); // bookings is already an array

//     // Show congratulations popup if bookings > 3
//     // useEffect(() => {
//     //     if (Array.isArray(bookings) && bookings.length >= 3) {
//     //         setShowCongrats(true);
//     //         const timer = setTimeout(() => setShowCongrats(false), 6000);
//     //         return () => clearTimeout(timer);
//     //     }
//     // }, [bookings]);

//     useEffect(() => {
//         if (location.state?.justBooked && bookings.length >= 3) {
//             setShowCongrats(true);
//             const timer = setTimeout(() => setShowCongrats(false), 6000);
//             return () => clearTimeout(timer);
//         }
//     }, [location.state, bookings]);


//     return (
//         <>
//             {showCongrats && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded shadow-lg text-center animate-fadeIn">
//                         🎉 Congratulations! You've booked 3 or more packages! 🎉
//                     </div>
//                 </div>
//             )}

//             {/* This is your normal BookingPage content */}
//             <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
//             <ul>
//                 {bookings.map((booking) => (
//                     <li key={booking._id}>{booking.packageName} - {booking.tourDate.start}</li>
//                 ))}
//             </ul>
//         </>
//     );
// };

// export default BookingPage;
