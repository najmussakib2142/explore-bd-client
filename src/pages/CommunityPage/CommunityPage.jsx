import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { FaHeart, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Loading from "../shared/Loading/Loading";

import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

// LightGallery CSS
// import 'lightgallery/css/lightgallery.css';
// import 'lightgallery/css/lg-thumbnail.css';
// import 'lightgallery/css/lg-zoom.css';

export default function CommunityStories() {
    const axiosInstance = useAxios();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const galleryRef = useRef(null);

    const [selectedStory, setSelectedStory] = useState(null);
    const [likeLoading, setLikeLoading] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Server-side pagination query
    const { data = {}, isLoading } = useQuery({
        queryKey: ["stories", currentPage, itemsPerPage],
        queryFn: async () => {
            const res = await axiosInstance.get("/stories", {
                params: { page: currentPage, limit: itemsPerPage },
            });
            return res.data; // { stories: [...], count: totalCount }
        },
        keepPreviousData: true,
    });

    const stories = data.stories || [];
    const count = data.count || 0;
    const numberOfPages = Math.ceil(count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    const handleItemsPerPage = (e) => {
        const value = parseInt(e.target.value);
        setItemsPerPage(value);
        setCurrentPage(0);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pages.length - 1) setCurrentPage(currentPage + 1);
    };

    // Mutation for like/unlike
    const likeMutation = useMutation({
        mutationFn: async ({ storyId, userId }) => {
            const res = await axiosInstance.patch(`/stories/${storyId}/like`, { userId });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["stories", currentPage, itemsPerPage], (oldData) => ({
                ...oldData,
                stories: oldData.stories.map((story) =>
                    story._id === variables.storyId ? { ...story, likes: data.likes } : story
                ),
            }));
            setLikeLoading(null);
        },
        onError: () => setLikeLoading(null),
    });

    const handleLike = (story) => {
        if (!user) return navigate("/login");
        const userId = user._id || user.uid || user.email;
        setLikeLoading(story._id);
        likeMutation.mutate({ storyId: story._id, userId });
    };

    const hasLiked = (story) => {
        const userId = user?._id || user?.uid || user?.email;
        return story.likes?.includes(userId);
    };

    useEffect(() => {
        if (selectedStory && galleryRef.current) {
            // refresh LightGallery when modal opens
            galleryRef.current.refresh();
        }
    }, [selectedStory]);

    if (isLoading) return <Loading />;



    return (
        <section className="max-w-7xl mx-auto py-10 px-7">
            <h2 className="text-3xl font-bold mb-6" data-aos="fade-down">Community Stories</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stories.map((story, idx) => (
                    <div
                        key={story._id}
                        className="bg-white dark:bg-gray-900 border-gray-600 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                        data-aos="fade-up"
                        data-aos-delay={idx * 100}
                    >
                        <img
                            src={story.images?.[0]}
                            alt={story.title}
                            className="w-full h-48 object-cover"
                            onClick={() => setSelectedStory(story)}
                            data-aos="zoom-in"
                        />
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{story.title}</h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(story);
                                    }}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors duration-300 ${hasLiked(story) ? "text-red-500" : "text-gray-500 dark:text-gray-300"
                                        }`}
                                    disabled={likeLoading === story._id}
                                >
                                    {likeLoading === story._id ? <FaSpinner className="animate-spin" /> : <FaHeart className="text-lg" />}
                                    <span className="text-sm">{story.likes?.length || 0}</span>
                                </button>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{story.description}</p>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    {story.createdBy?.photo ? (
                                        <img
                                            src={story.createdBy.photo}
                                            alt={story.createdBy?.name || "User"}
                                            className="w-8 h-8 rounded-full border"
                                            data-aos="fade-right"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full border bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-600">
                                            {story.createdBy?.name?.[0] || "U"}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-400">{story.createdBy?.name || "Unknown"}</span>
                                </div>

                                <div className="flex pb-2 justify-end mt-3">
                                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer">
                                        {user ? (
                                            <FacebookShareButton
                                                url={window.location.origin + "/story/" + story._id}
                                                quote={story.title}
                                                hashtag="#TravelStory"
                                                className="flex items-center gap-2"
                                            >
                                                <FacebookIcon size={22} round />
                                                <span>Share</span>
                                            </FacebookShareButton>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FacebookIcon size={22} round />
                                                <span>Share</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination mt-6 flex justify-center items-center gap-2" data-aos="fade-up">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                    Prev
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${currentPage === page ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                            }`}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === pages.length - 1}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                    Next
                </button>
                <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPage}
                    className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                >
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
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

                        <p className="text-gray-700 dark:text-gray-300 ">
                            <span className="text-blue-400">Created At:</span>{" "}
                            {selectedStory.createdAt
                                ? new Date(selectedStory.createdAt).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })
                                : "N/A"}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            <span className="text-blue-400">Added By:</span>{" "}
                            {selectedStory.createdBy?.name || "Unknown"}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedStory.description}</p>

                        <LightGallery
                            onInit={(ref) => (galleryRef.current = ref.instance)}
                            speed={500}
                            plugins={[lgThumbnail, lgZoom]}
                        >
                            <div className="flex flex-wrap gap-3 mb-4">
                                {selectedStory.images?.filter(Boolean).map((img, idx) => (
                                    <a key={idx} href={img}>
                                        <img
                                            src={img}
                                            alt={`story-${idx}`}
                                            className="w-32 h-32 object-cover rounded cursor-pointer"
                                        />
                                    </a>
                                ))}
                            </div>
                        </LightGallery>
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
        </section>
    );
}
