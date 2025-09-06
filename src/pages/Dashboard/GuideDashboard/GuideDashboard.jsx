import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
// import Loading from "../../shared/Loading/Loading";
import EditProfileModal from "./EditProfileModal";
import AOS from "aos";
import "aos/dist/aos.css";
import Loading from "../../shared/Loading/Loading";
import { motion, AnimatePresence } from "framer-motion";


const GuideDashboard = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const axiosInstance = useAxios();
    const axiosSecure = useAxios()

    // Initialize AOS
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleEdit = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const email = user?.email;

    // Fetch guide info from backend
    const { data: guideInfo = {}, isLoading } = useQuery({
        queryKey: ["guide", email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/guides/${email}`);
            return res.data;
        },
        enabled: !!email, // prevents running query before user?.email exists
    });

    // Fetch accepted bookings


    // console.log(guideInfo);

    if (isLoading) return <Loading />;

    return (
        <>
            <div
                className="bg-base-100  flex flex-col items-center md:items-start  p-6 rounded-lg shadow-lg space-y-6"
                data-aos="fade-up"
            >
                {/* Welcome message */}
                <h2 className="text-2xl font-bold">
                    Welcome, <span className="text-primary">{user?.displayName || "Guide"}!</span>
                </h2>

                {/* Guide info */}
                <div className="bg-base-100 rounded-2xl border border-base-100 border-x-indigo-400 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 transition-all duration-300">
                    {/* Profile Picture */}
                    {user?.photoURL ? (
                        <img
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md hover:scale-105 transition-transform"
                            src={user.photoURL}
                            alt="Guide"
                        />
                    ) : (
                        <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-primary" />
                    )}

                    {/* Info Section */}
                    <div className="flex-1 space-y-3">
                        <p className="text-lg">
                            <span className="font-semibold text-primary">Name:</span>{" "}
                            <span className="text-gray-800 dark:text-gray-200">{user?.displayName}</span>
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-primary">Email:</span>{" "}
                            <span className="text-gray-800 dark:text-gray-200">{user?.email}</span>
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-primary">Role:</span>{" "}
                            <span className="text-gray-800 dark:text-gray-200">{guideInfo?.role || "Guide"}</span>
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold text-primary">Status:</span>{" "}
                            <span className="text-gray-800 dark:text-gray-200">
                                {guideInfo?.status === "rejected" ? "Deactivated" : guideInfo?.status || "Guide"}
                            </span>
                        </p>

                        {/* Extra fields */}
                        {guideInfo?.bio && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                <span className="font-semibold text-primary">Bio:</span> {guideInfo.bio}
                            </p>
                        )}
                        {guideInfo?.experience && (
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold text-primary">Experience:</span> {guideInfo.experience} years
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4  ">
                    <button className="btn btn-primary" onClick={handleEdit}>
                        Edit Profile
                    </button>
                </div>

                {/* Edit Modal */}

            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }} // simple fade in/out
                    >
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg relative">
                            <EditProfileModal
                                user={user}
                                guideInfo={guideInfo}
                                onClose={handleClose}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>



        </>

    );
};

export default GuideDashboard;
