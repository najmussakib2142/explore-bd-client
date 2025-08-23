import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSpinner, FaTimes } from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../shared/Loading/Loading";

const AddStory = () => {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();
    const axiosInstance = useAxios()
    const { user } = useAuth();
    const [pictures, setPictures] = useState([]); // uploaded image URLs
    const [uploading, setUploading] = useState(false);
    const email = user?.email


    // ✅ mutation for saving story
    const { mutate, isLoading } = useMutation({
        mutationFn: async (newStory) => {
            const res = await axiosInstance.post("/stories", newStory);
            return res.data;
        },
        onSuccess: () => {
            Swal.fire("Success!", "Your story has been added!", "success");
            reset();
            setPictures([]);
            navigate("/communityPage");
        },
        onError: (error) => {
            Swal.fire("Error", error?.message || "Something went wrong", "error");
        },
    });


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


    // ✅ handle image upload
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("image", files[i]);

            const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
            try {
                const res = await axiosInstance.post(uploadUrl, formData);
                console.log(res);
                uploadedUrls.push(res.data?.data?.url);
                // if (url) uploadedUrls.push(url);
            } catch (err) {
                console.error("Image upload failed:", err);
                Swal.fire(
                    "Upload failed",
                    err?.message || "Please try again",
                    "error"
                );
            }
        }

        setPictures((prev) => [...prev, ...uploadedUrls.filter(Boolean)]);
        setUploading(false);

        // Reset input so user can select same file again
        e.target.value = "";
    };

    const handleDelete = (index) => {
        setPictures((prev) => prev.filter((_, i) => i !== index));
    };


    const onSubmit = (data) => {
        if (!pictures.length) {
            Swal.fire("Oops!", "Please upload at least one image", "warning");
            return;
        }

        const story = {
            title: data.title,
            description: data.description,
            images: pictures,
            createdAt: new Date().toISOString(),
            createdBy: {
                name: user.displayName || "Anonymous",
                email: user.email,
                role: userInfo?.role || "user",
                photo: user.photoURL || "",
            },
        };

        mutate(story);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                ✨ Add Your Story
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="font-semibold mb-1 block">Story Title</label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500 
                       dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        placeholder="Enter story title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="font-semibold mb-1 block">Story Text</label>
                    <textarea
                        {...register("description", { required: true })}
                        rows="5"
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-500
                       dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        placeholder="Write your story..."
                    ></textarea>
                </div>

                {/* Images */}
                <div>
                    <label className="font-semibold mb-1 block">Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered w-full"
                        accept="image/*"
                    />

                    {/* Loader */}
                    {uploading && (
                        <div className="flex items-center gap-2 mt-2 text-blue-500">
                            <FaSpinner className="animate-spin" />
                            <span>Uploading...</span>
                        </div>
                    )}

                    {/* Previews */}
                    {!!pictures.length && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {pictures.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={img}
                                        alt={`story-${idx}`}
                                        className="w-24 h-24 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(idx)}
                                        className="absolute -top-2 -right-2 bg-black bg-opacity-60 text-white p-1 rounded-full hover:bg-red-600"
                                        aria-label="Remove image"
                                        title="Remove image"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg 
                     shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                     disabled:opacity-60"
                >
                    {isLoading ? "Saving..." : "Submit Story"}
                </button>
            </form>
        </div>
    );
};

export default AddStory;
