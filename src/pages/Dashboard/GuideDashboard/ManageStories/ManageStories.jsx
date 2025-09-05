import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import useAxios from "../../../../hooks/useAxios";
import useAuth from "../../../../hooks/useAuth";
import Loading from "../../../shared/Loading/Loading";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const ManageStories = () => {
    const { user } = useAuth();
    const guideEmail = user?.email;
    // const axiosInstance = useAxios();
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [pendingStoryId, setPendingStoryId] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Fetch all stories by guide
    const { data: stories = [], isLoading } = useQuery({
        queryKey: ["stories", guideEmail],
        queryFn: async () => {
            if (!guideEmail) return [];
            const res = await axiosSecure.get(`/stories/guide/${guideEmail}`);
            return res.data;
        },
        enabled: !!guideEmail,
    });

    // Delete story mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            setPendingStoryId(id);
            const res = await axiosSecure.delete(`/stories/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["stories", guideEmail]);
            setPendingStoryId(null);
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Your story has been deleted.",
                timer: 1500,
                showConfirmButton: false,
            });
        },
        onError: () => {
            setPendingStoryId(null);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to delete the story!",
            });
        },
    });

    // Edit button click
    const handleEdit = (id) => navigate(`/dashboard/editStoryPage/${id}`);

    // Delete button click using Swal
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    if (isLoading) return <Loading />;

    return (
        <div className="max-w-6xl mx-auto p-2 md:p-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-primary" data-aos="fade-down">
                Manage Your Stories
            </h2>

            {stories.length === 0 ? (
                <p className="text-gray-500 text-center text-lg" data-aos="fade-up">
                    You haven’t added any stories yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2  gap-5">
                    {stories.map((story, idx) => (
                        <div
                            key={story._id}
                            className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
                            data-aos="fade-up"
                            data-aos-delay={idx * 100}
                        >
                            <img
                                src={story.images?.[0] || "https://via.placeholder.com/400"}
                                alt={story.title}
                                className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-5 space-y-3">
                                <h3 className="text-xl line-clamp-1 font-semibold">{story.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                    {story.description}
                                </p>
                                <div className="flex justify-between mt-3 items-center">
                                    <button
                                        className="btn btn-sm btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                                        onClick={() => handleEdit(story._id)}
                                        data-aos="zoom-in"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-error flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                                        onClick={() => handleDelete(story._id)}
                                        disabled={pendingStoryId === story._id}
                                        data-aos="zoom-in"
                                    >
                                        {pendingStoryId === story._id ? (
                                            <>
                                                <FaSpinner className="animate-spin" /> Deleting
                                            </>
                                        ) : (
                                            <>
                                                <FaTrash /> Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageStories;
