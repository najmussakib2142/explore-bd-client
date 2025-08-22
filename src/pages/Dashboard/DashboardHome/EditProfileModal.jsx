import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
// import useAuth from "../../../hooks/useAuth";

const EditProfileModal = ({ user, onClose }) => {
    const { updateUserProfile } = useAuth()
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [profilePic, setProfilePic] = useState(user?.photoURL || "");

    // const handleSave = async () => {
    //     // Update user profile logic (Firebase or backend)
    //     try {
    //         // Example using Firebase updateUserProfile
    //         await user.updateUserProfile({ displayName, photoURL });

    //         Swal.fire("Success!", "Profile updated successfully.", "success");
    //         onClose();
    //     } catch (err) {
    //         Swal.fire("Error!", err.message || "Failed to update profile.", "error");
    //     }
    // };
    

    const { mutate: updateUserInDb, isLoading } = useMutation({
        mutationFn: async (profileData) => {
            const res = await useAxiosSecure.patch(`/users/${user.email}`, profileData);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Profile Updated",
                text: "Your profile has been successfully updated."
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message
            });
        }
    });

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            displayName: user?.displayName || "",
            email: user?.email || ""
        }
    });

    const onSubmit = async (data) => {
        try {
            // 1️⃣ Update Firebase profile
            const userProfile = {
                displayName: data.displayName,
                photoURL: profilePic
            };
            await updateUserProfile(userProfile);
            console.log("Firebase profile updated");

            // 2️⃣ Update MongoDB profile
            const userInfo = {
                displayName: data.displayName,
                photoURL: profilePic,
                email: data.email,
                last_log_in: new Date().toISOString()
            };
            updateUserInDb(userInfo);

            // Reset form with updated values
            reset({
                displayName: data.displayName,
                email: data.email
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message
            });
        }
    };


    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append("image", image);

        const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
        const res = await axios.post(imageUploadUrl, formData);
        setProfilePic(res.data.data.url);
        console.log("Image uploaded:", res.data.data.url);
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-xl  flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-96 shadow-lg space-y-4 relative">
                <h3 className="text-xl font-semibold">Edit Profile</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <label className="block font-semibold">Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="input input-bordered w-full"
                    />

                    <label className="label">Your Profile Picture</label>
                    <input type="file"
                        onChange={handleImageUpload}
                        className="input" placeholder="Your Profile Picture"
                    />


                    {/* <label className="block font-semibold">Photo URL</label>
                    <input
                        type="text"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="input input-bordered w-full"
                    /> */}

                    {/* <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            readOnly
                            className="input input-bordered w-full text-black bg-base-100"
                            {...register("email")}
                        />
                    </div> */}
                    <label className="block font-semibold">Email</label>
                    <input type="text" value={user?.email} readOnly className="input input-bordered w-full bg-base-100" />

                    <label className="block font-semibold">Role</label>
                    <input type="text" value={user?.role || "User"} readOnly className="input input-bordered w-full bg-base-100" />
                </form>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button
                        type="submit"
                        className="btn text-black btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Profile"}
                    </button>                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
