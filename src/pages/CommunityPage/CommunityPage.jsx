import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

export default function CommunityStories() {
    const axiosInstance = useAxios();
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedStory, setSelectedStory] = useState(null);

    // Fetch stories
    const { data: stories = [] } = useQuery({
        queryKey: ["stories", "all"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stories");
            return res.data;
        },
    });

    // Mutation for like/unlike
    const likeMutation = useMutation({
        mutationFn: async ({ storyId, userId }) => {
            const res = await axiosInstance.patch(`/stories/${storyId}/like`, { userId });
            return res.data;
        },
        // Optimistic update for instant UI feedback
        onMutate: async ({ storyId, userId }) => {
            await queryClient.cancelQueries(["stories", "all"]);

            const prevStories = queryClient.getQueryData(["stories", "all"]);

            queryClient.setQueryData(["stories", "all"], (oldStories) =>
                oldStories.map((story) =>
                    story._id === storyId
                        ? {
                            ...story,
                            likes: story.likes?.includes(userId)
                                ? story.likes.filter((id) => id !== userId) // unlike
                                : [...(story.likes || []), userId], // like
                        }
                        : story
                )
            );

            return { prevStories };
        },
        onError: (err, variables, context) => {
            if (context?.prevStories) {
                queryClient.setQueryData(["stories", "all"], context.prevStories);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(["stories", "all"]);
        },
    });

    const handleLike = (story) => {
        if (!user) return navigate("/login");
        if (likeMutation.isLoading) return; // prevent spamming
        likeMutation.mutate({ storyId: story._id, userId: user._id });
    };

    const hasLiked = (story) => story.likes?.includes(user?._id);

    return (
        <section className="max-w-7xl mx-auto py-10 px-4">
            <h2 className="text-2xl font-bold mb-6">Community Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                    <div
                        key={story._id}
                        className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                        <img
                            src={story.images?.[0]}
                            alt={story.title}
                            className="w-full h-48 object-cover"
                            onClick={() => setSelectedStory(story)}
                        />

                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{story.title}</h3>

                                {/* Like Button */}
                                <button
                                    onClick={() => handleLike(story)}
                                    disabled={likeMutation.isLoading}
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-300 ${hasLiked(story)
                                            ? "text-red-500 scale-105"
                                            : "text-gray-500 dark:text-gray-300 hover:text-red-400"
                                        } ${likeMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <FaHeart
                                        className={`text-lg transition-transform duration-200 ${hasLiked(story) ? "scale-110" : "scale-100"
                                            }`}
                                    />
                                    <span className="text-sm">{story.likes?.length || 0}</span>
                                </button>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                {story.description}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={story.createdBy?.photo}
                                        alt={story.createdBy?.name}
                                        className="w-8 h-8 rounded-full border"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-400">
                                        {story.createdBy?.name}
                                    </span>
                                </div>
                            </div>

                            {/* Share Button */}
                            <div className="flex justify-end mt-3">
                                <div
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer"
                                >
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
                ))}
            </div>

            {/* Modal */}
            {selectedStory && (
                <div
                    className="fixed inset-0  bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50"
                    onClick={() => setSelectedStory(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-3xl w-full overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-1">{selectedStory.title}</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            <span className="text-blue-400">Added By:</span>{" "}
                            {selectedStory.createdBy?.name}
                        </p>

                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {selectedStory.description}
                        </p>

                        <div className="flex flex-wrap gap-3 mb-4">
                            {selectedStory.images?.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`story-${idx}`}
                                    className="w-32 h-32 object-cover rounded"
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
        </section>
    );
}
