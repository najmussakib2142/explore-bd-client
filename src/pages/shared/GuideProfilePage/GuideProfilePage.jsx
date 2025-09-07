import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
// import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../Loading/Loading";

const GuideProfilePage = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    // const axiosSecure = useAxiosSecure()
    const navigate = useNavigate();
    const [selectedStory, setSelectedStory] = useState(null); // modal


    // Fetch guide data
    // const {
    //     data: guide = [],
    //     isLoading: loadingGuide,
    //     isError: errorGuide,
    // } = useQuery({
    //     queryKey: ["guide", id],
    //     queryFn: async () => {
    //         const res = await axiosSecure.get("/guides/approved");
    //         const guideData = res.data.find((g) => g._id === id);
    //         if (!guideData) throw new Error("Guide not found");
    //         return guideData;
    //     },
    // });

    const {
        data: guide = {},
        isLoading: loadingGuide,
        isError: errorGuide,
    } = useQuery({
        queryKey: ["guide", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/guides/id/${id}`);
            return res.data;
        },
    });

    // Fetch guide stories
    // const { data: stories = [], isLoading: loadingStories, isError: errorStories, } = useQuery({
    //     queryKey: ["stories", "guide", guide?.email],
    //     queryFn: async () => {
    //         const res = await axiosInstance.get(`/stories/guide/${guide.email}`);
    //         // if (!guide) return [];
    //         return res.data;
    //     },
    //     enabled: !!guide?.email, // wait until guide is loaded
    // });

    const { data: stories = [], isLoading: loadingStories, isError: errorStories } = useQuery({
        queryKey: ["stories", guide?.email], // keep guide.email in the key
        queryFn: async ({ queryKey }) => {
            const [_key, email] = queryKey;
            if (!email) return []; // safeguard
            const res = await axiosInstance.get(`/stories/guide/${email}`);
            return res.data;
        },
        enabled: !!guide?.email, // only run when guide.email exists
    });


    if (loadingGuide || loadingStories)
        return (
            <Loading></Loading>
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
            <button className="btn btn-outline mb-6" onClick={() => navigate(-1)} data-aos="fade-right">
                <FaArrowLeft className="mr-2" /> Back
            </button>

            {/* Profile Card */}
            <div
                className="flex flex-col md:flex-row bg-base-100 shadow-lg rounded-xl overflow-hidden"
                data-aos="fade-up"
            >
                <img
                    src={guide.photoURL || "https://via.placeholder.com/300"}
                    alt={guide.name}
                    className="w-full md:w-1/3 h-64 object-cover"
                    data-aos="zoom-in"
                />
                <div className="p-6 space-y-2 md:w-2/3" data-aos="fade-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{guide.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-primary">Region:</span> {guide.district || "N/A"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-primary">Experience:</span> {guide.experience || "N/A"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-primary">Age:</span> {guide.age || "N/A"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-primary">Phone:</span> {guide.phone || "N/A"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-primary">About:</span> {guide.bio || "No introduction provided."}
                    </p>
                </div>
            </div>

            {/* Stories Section */}
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4" data-aos="fade-up">Stories by {guide.name}</h3>

                {stories.length === 0 ? (
                    <p className="text-gray-400" data-aos="fade-up">
                        {guide.name} hasn’t added any stories yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stories.map((story, idx) => (
                            <div
                                key={story._id}
                                onClick={() => setSelectedStory(story)}
                                className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                                data-aos="fade-up"
                                data-aos-delay={idx * 100}
                            >
                                <img
                                    src={story.images?.[0] || "https://via.placeholder.com/400"}
                                    alt={story.title}
                                    className="w-full h-48 object-cover"
                                    data-aos="zoom-in"
                                />
                                <div className="p-4 space-y-2">
                                    <h4 className="text-lg font-semibold">{story.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{story.description}</p>
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
                                        <span className="text-sm text-gray-700 dark:text-gray-400">{story.createdBy?.name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedStory && (
                <div
                    className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50"
                    onClick={() => setSelectedStory(null)}
                    data-aos="fade-in"
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-3xl w-full overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                        data-aos="zoom-in"
                    >
                        <h2 className="text-2xl font-bold mb-1">{selectedStory.title}</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            <span className="text-blue-400">Added By:</span> {selectedStory.createdBy?.name}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedStory.description}</p>
                        <div className="flex flex-wrap gap-3 mb-4">
                            {selectedStory.images?.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`story-${idx}`}
                                    className="w-32 h-32 object-cover rounded"
                                    data-aos="zoom-in"
                                    data-aos-delay={idx * 100}
                                />
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => setSelectedStory(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideProfilePage;
