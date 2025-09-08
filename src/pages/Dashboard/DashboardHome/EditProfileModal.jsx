import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { FaSpinner } from "react-icons/fa";

// for user

const EditProfileModal = ({ user, onClose }) => {
    const { updateUserProfile } = useAuth();
    const axiosInstance = useAxios();
    const [uploading, setUploading] = useState(false);
    const [profilePic, setProfilePic] = useState(user?.photoURL || "");

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            displayName: user?.displayName || "",
            email: user?.email || "",
            role: user?.role || "User",
        },
    });

    // Handle image upload
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("image", image);

        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        const res = await axiosInstance.post(imageUploadUrl, formData);
        setProfilePic(res.data.data.url);
        setUploading(false);
    };

    const onSubmit = async (data) => {
        try {
            // 1️⃣ Update Firebase
            await updateUserProfile({ displayName: data.displayName, photoURL: profilePic });

            // 2️⃣ Update backend
            await axiosInstance.patch(`/users/${data.email}`, {
                displayName: data.displayName,
                photoURL: profilePic,
                last_log_in: new Date().toISOString(),
            });

            Swal.fire("Success!", "Profile updated successfully.", "success");
            reset({ ...data, photoURL: profilePic });
            onClose();
        } catch (err) {
            Swal.fire("Error!", err.message || "Failed to update profile.", "error");
        }
    };

    useEffect(() => {
        reset({
            displayName: user?.displayName || "",
            email: user?.email || "",
            role: user?.role || "User",
        });
    }, [user, reset])

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-lg flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-96 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="font-semibold">Name</label>
                        <input
                            type="text"
                            {...register("displayName", { required: true })}
                            className="input input-bordered w-full"
                            placeholder="Your Name"
                        />
                    </div>

                    {/* Profile Picture */}
                    <div>
                        <label className="font-semibold">Profile Picture</label>
                        <input type="file" onChange={handleImageUpload} className="input w-full" />
                        {profilePic && (
                            <img
                                src={profilePic}
                                alt="Profile Preview"
                                className="w-24 h-24 mt-2 rounded-full border object-cover"
                            />
                            // {uploading && <p className="text-blue-500">Uploading image...</p>}
                        )}
                        {uploading && (
                            <div className="flex items-center gap-2 mt-2 text-blue-500">
                                <FaSpinner className="animate-spin" />
                                <span>Uploading...</span>
                            </div>
                        )}

                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="font-semibold">Email</label>
                        <input
                            type="text"
                            {...register("email")}
                            readOnly
                            className="input input-bordered w-full bg-gray-100 dark:bg-gray-800"
                        />
                    </div>

                    {/* Role (read-only) */}
                    <div>
                        <label className="font-semibold">Role</label>
                        <input
                            type="text"
                            {...register("role")}
                            readOnly
                            className="input input-bordered w-full bg-gray-100 dark:bg-gray-800"
                        />
                    </div>

                    <div className="flex flex-col justify-between gap-2">
                        <button type="submit" className="btn btn-primary w-full">
                            Update Profile
                        </button>
                        <button type="button" onClick={onClose} className="btn border-secondary btn-ghost w-full">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
