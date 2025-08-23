import React from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";

const GuideProfilePage = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const axiosSecure = useAxiosSecure()
    const navigate = useNavigate();

    // Fetch guide data
    const {
        data: guide = [],
        isLoading: loadingGuide,
        isError: errorGuide,
    } = useQuery({
        queryKey: ["guide", id],
        queryFn: async () => {
            const res = await axiosSecure.get("/guides/approved");
            const guideData = res.data.find((g) => g._id === id);
            if (!guideData) throw new Error("Guide not found");
            return guideData;
        },
    });

    // Fetch guide stories
    const { data: stories = [], isLoading: loadingStories, isError: errorStories, } = useQuery({
        queryKey: ["stories", "guide", guide?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/stories/guide/${guide.email}`);
            // if (!guide) return [];
            return res.data;
        },
        enabled: !!guide?.email, // wait until guide is loaded
    });

    if (loadingGuide || loadingStories)
        return (
            <Loading></Loading>
            // <div className="flex justify-center items-center py-20 text-green-600">
            //     <FaSpinner className="animate-spin mr-2" /> Loading guide profile...
            // </div>
        );

    if (errorGuide)
        return (
            <div className="text-center py-20 text-red-500">
                Guide not found.
            </div>
        );

    if (errorStories)
        return (
            <div className="text-center py-20 text-gray-500">
                Failed to load stories.
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto my-12 p-4">
            <button
                className="btn btn-outline mb-6"
                onClick={() => navigate(-1)}
            >
                <FaArrowLeft className="mr-2" /> Back
            </button>
            
            <div className="flex flex-col md:flex-row bg-base-100 shadow-lg rounded-xl overflow-hidden">

                <img
                    src={guide.photoURL || "https://via.placeholder.com/300"}
                    alt={guide.name}
                    className="w-full md:w-1/3 h-64 object-cover"
                />
                <div className="p-6 md:w-2/3">
                    <h2 className="text-3xl font-bold mb-2">{guide.name}</h2>
                    <p className="text-gray-500 mb-2">Region: {guide.district || "N/A"}</p>
                    <p className="text-gray-500 mb-2">Experience: {guide.experience || "N/A"} yrs</p>
                    <p className="text-gray-500 mb-2">Age: {guide.age || "N/A"}</p>
                    <p className="text-gray-500 mb-2">Phone: {guide.phone || "N/A"}</p>
                    <p className="text-gray-500 mb-2">Bio: {guide.bio || "No introduction provided."}</p>

                    {/* Stories Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">Stories by {guide.name}</h3>

                        {stories.length === 0 ? (
                            <p className="text-gray-400">
                                {guide.name} hasn’t added any stories yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stories.map((story) => (
                                    <div
                                        key={story._id}
                                        className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                                    >
                                        <img
                                            src={story.images?.[0] || "https://via.placeholder.com/400"}
                                            alt={story.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4 space-y-2">
                                            <h4 className="text-lg font-semibold">{story.title}</h4>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                                {story.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {story.createdBy?.photo ? (
                                                    <img
                                                        src={story.createdBy.photo}
                                                        alt={story.createdBy.name}
                                                        className="w-6 h-6 rounded-full border"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600">
                                                        {story.createdBy?.name?.[0] || "G"}
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-700 dark:text-gray-400">
                                                    {story.createdBy?.name} ({story.createdBy?.role || "User"})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideProfilePage;
