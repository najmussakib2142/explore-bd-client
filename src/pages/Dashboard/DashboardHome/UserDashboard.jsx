import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
// import useAuth from "../../hooks/useAuth";
import EditProfileModal from "./EditProfileModal";
import useAuth from "../../../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Loading/Loading";
import useAxios from "../../../hooks/useAxios";

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const axiosInstance = useAxios()
    const handleEdit = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);
    const handleApplyGuide = () => navigate("/dashboard/beAGuide");

    const email = user?.email
    const { data: userInfo = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["user", "email"],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users/${email}`);
            return res.data;
        },
    });

    if (loadingUsers) {
        return <Loading></Loading>
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-6">
            {/* Welcome message */}
            <h2 className="text-2xl font-bold">Welcome, {user?.displayName || "User"}!</h2>

            {/* User Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* <img
                    src={user?.photoURL || <FaUserCircle className=" text-gray-600 dark:text-primary transition-colors" />}
                    alt={user?.displayName}
                    className="w-32 h-32 object-cover rounded-full shadow-md"
                /> */}
                {user?.photoURL ? (
                    <img
                        className="w-32 h-32 rounded-full object-cover dark:border dark:border-primary"
                        src={user.photoURL}
                        alt="User"
                    />
                ) : (
                    <FaUserCircle className="w-32 h-32 text-gray-600 dark:text-primary transition-colors" />)}

                <div className="flex-1 space-y-2">
                    <p><span className="font-semibold">Name:</span> {user?.displayName}</p>
                    <p><span className="font-semibold">Email:</span> {user?.email}</p>
                    <p><span className="font-semibold">Role:</span> {userInfo?.role || "User"}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button className="btn btn-primary" onClick={handleEdit}>Edit Profile</button>

                <button className="btn btn-secondary" onClick={handleApplyGuide}>
                    Apply for Tour Guide
                </button>
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <EditProfileModal user={user} onClose={handleClose} />
            )}
        </div>
    );
};

export default UserDashboard;
