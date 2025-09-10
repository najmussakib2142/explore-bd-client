import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { FaSpinner } from "react-icons/fa";

// for guide

const EditProfileModal = ({ user, onClose, guideInfo }) => {
    const { updateUserProfile } = useAuth();
    const axiosInstance = useAxios();
    const [uploading, setUploading] = useState(false);
    const [profilePic, setProfilePic] = useState(user?.photoURL || "");

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            displayName: user?.displayName || "",
            email: user?.email || "",
            role: guideInfo?.role || "Guide",
            bio: guideInfo?.bio || "",
            experience: guideInfo?.experience || "",
            languages: guideInfo?.languages || "",
            phone: guideInfo?.phone || "",
        },
    });
    // console.log(guideInfo);

    // Handle image upload
    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("image", image);

        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        try {
            const res = await axiosInstance.post(imageUploadUrl, formData);
            setProfilePic(res.data.data.url);
        } catch {
            Swal.fire("Error", "Failed to upload image", "error");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            // 1️⃣ Update Firebase (only displayName & photo)
            await updateUserProfile({ displayName: data.displayName, photoURL: profilePic });

            // 2️⃣ Update backend (guide-specific fields)
            await axiosInstance.patch(`/guides/${data.email}`, {
                displayName: data.displayName,
                photoURL: profilePic,
                bio: data.bio,
                experience: data.experience,
                languages: data.languages,
                phone: data.phone,
                last_log_in: new Date().toISOString(),
            });

            Swal.fire("Success!", "Profile updated successfully.", "success");
            reset({ ...data, photoURL: profilePic });
            onClose();
        } catch (err) {
            Swal.fire("Error!", err.message || "Failed to update profile.", "error");
        }
    };

    return (
        <div className="fixed overflow-auto inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50  p-4">
            <div className="bg-base-100 dark:bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md mt-10 mb-10">
                <h3 className="text-2xl font-bold mb-4 text-primary">Edit Guide Profile</h3>

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
                        )}
                        {uploading && (
                            <div className="flex items-center gap-2 mt-2 text-blue-500">
                                <FaSpinner className="animate-spin" />
                                <span>Uploading...</span>
                            </div>
                        )}
                    </div>

                    {/* Guide-specific fields */}
                    <div>
                        <label className="font-semibold">Bio</label>
                        <textarea
                            {...register("bio")}
                            className="textarea textarea-bordered w-full"
                            placeholder="Short bio about you"
                        ></textarea>
                    </div>

                    <div>
                        <label className="font-semibold">Experience (years)</label>
                        <input
                            type="text"
                            {...register("experience")}
                            className="input input-bordered w-full"
                            placeholder="e.g. 3"
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Languages</label>
                        <input
                            type="text"
                            {...register("languages")}
                            className="input input-bordered w-full"
                            placeholder="English, Bengali, etc."
                        />
                    </div>

                    <div>
                        <label className="font-semibold">Phone</label>
                        <input
                            type="text"
                            {...register("phone")}
                            className="input input-bordered w-full"
                            placeholder="Optional"
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="font-semibold">Email</label>
                        <input
                            type="text"
                            {...register("email")}
                            readOnly
                            className="input cursor-not-allowed input-bordered w-full bg-gray-100 dark:bg-gray-800"
                        />
                    </div>

                    {/* Role (read-only) */}
                    <div>
                        <label className="font-semibold">Role</label>
                        <input
                            type="text"
                            {...register("role")}

                            readOnly
                            className="input cursor-not-allowed input-bordered w-full bg-gray-100 dark:bg-gray-800"
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
