import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner, FaTrash } from "react-icons/fa";
import useAxios from "../../../../hooks/useAxios";
import Loading from "../../../shared/Loading/Loading";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import axios from "axios";
import Swal from "sweetalert2";

const EditStoryPage = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [removingImage, setRemovingImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch story data
    const { data: story = {}, isLoading } = useQuery({
        queryKey: ["story", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/stories/${id}`);
            return res.data;
        },
    });

    // Set initial form data when story loads
    useEffect(() => {
        if (story) {
            setTitle(story.title || "");
            setDescription(story.description || "");
            setImages(story.images || []);
        }
    }, [story]);

    // Update story mutation
    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axiosSecure.patch(`/stories/${id}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["stories"]);
            queryClient.invalidateQueries(["story", id]);
            navigate("/guide/stories"); // redirect after successful update
        },
    });

    if (isLoading) return <Loading />;

    // Remove image
    const handleRemoveImage = async (img) => {
        setRemovingImage(img);
        try {
            await axiosSecure.patch(`/stories/${id}`, { removeImages: [img] });
            setImages((prev) => prev.filter((i) => i !== img));
            setRemovingImage(null);
        } catch (err) {
            console.error(err);
            setRemovingImage(null);
        }
    };

    // Upload new images to imgbb
    // const handleAddImages = async (e) => {
    //     const files = e.target.files;
    //     if (!files?.length) return;

    //     setUploading(true);
    //     const uploadedUrls = [];

    //     for (let i = 0; i < files.length; i++) {
    //         const formData = new FormData();
    //         formData.append("image", files[i]);

    //         const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    //         try {
    //             const res = await axios.post(uploadUrl, formData);
    //             const url = res.data?.data?.url;
    //             if (url) uploadedUrls.push(url);
    //         } catch (err) {
    //             console.error("Image upload failed:", err);
    //             Swal.fire("Upload failed", err?.message || "Please try again", "error");
    //         }
    //     }

    //     setNewImages((prev) => [...prev, ...uploadedUrls]);
    //     setUploading(false);

    //     // Reset input so same file can be selected again
    //     e.target.value = "";
    // };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("image", files[i]);

            const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

            try {
                const res = await axios.post(uploadUrl, formData);
                const url = res.data?.data?.url;
                if (url) uploadedUrls.push(url);
            } catch (err) {
                console.error("Image upload failed:", err);
                Swal.fire("Upload failed", err?.message || "Please try again", "error");
            }
        }

        setNewImages((prev) => [...prev, ...uploadedUrls.filter(Boolean)]);
        setUploading(false);

        // Reset input so user can pick same file again
        e.target.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title,
            description,
            newImages, // ✅ already hosted image URLs
        };

        updateMutation.mutate(payload);
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Edit Story</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="font-semibold">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="textarea textarea-bordered w-full"
                        rows={5}
                        required
                    />
                </div>

                {/* Existing Images */}
                <div>
                    <label className="font-semibold">Existing Images</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative">
                                <img
                                    src={img}
                                    alt={`story-${idx}`}
                                    className="w-32 h-32 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    onClick={() => handleRemoveImage(img)}
                                    disabled={removingImage === img}
                                >
                                    {removingImage === img ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaTrash />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upload New Images */}
                <div>
                    <label className="font-semibold mb-1 block">Add New Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered w-full"
                        accept="image/*"
                        disabled={uploading}
                    />

                    {uploading && (
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                            <FaSpinner className="animate-spin" /> Uploading images...
                        </p>
                    )}

                    {newImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {newImages.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`new-${idx}`}
                                    className="w-32 h-32 object-cover rounded-lg shadow"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateMutation.isLoading || uploading}
                >
                    {updateMutation.isLoading ? (
                        <span className="flex items-center gap-2">
                            <FaSpinner className="animate-spin" /> Updating
                        </span>
                    ) : (
                        "Update Story"
                    )}
                </button>
            </form>
        </div>
    );
};

export default EditStoryPage;
