import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
// import useAuth from "../../hooks/useAuth";
import EditProfileModal from "./EditProfileModal";
import useAuth from "../../../hooks/useAuth";
import { FaUserCircle } from "react-icons/fa";

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEdit = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    const handleApplyGuide = () => navigate("/dashboard/beAGuide");

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-6">
            {/* Welcome message */}
            <h2 className="text-2xl font-bold">Welcome, {user?.displayName || "User"}!</h2>

            {/* User Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <img
                    src={user?.photoURL || <FaUserCircle className=" text-gray-600 dark:text-primary transition-colors" />}
                    alt={user?.displayName}
                    className="w-32 h-32 object-cover rounded-full shadow-md"
                />
                <div className="flex-1 space-y-2">
                    <p><span className="font-semibold">Name:</span> {user?.displayName}</p>
                    <p><span className="font-semibold">Email:</span> {user?.email}</p>
                    <p><span className="font-semibold">Role:</span> {user?.role || "User"}</p>
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
