import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

export default function TouristStorySection() {
    const axiosInstance = useAxios();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: stories = [] } = useQuery({
        queryKey: ["stories", "random"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stories/random");
            return res.data;
        },
    });

    const handleShare = () => {
        if (!user) {
            navigate("/login");
        }
    };

    return (
        <section className="max-w-7xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Tourist Stories</h2>
                <button
                    onClick={() => navigate("/communityPage")}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    All Stories
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stories.map((story) => (
                    <div
                        key={story._id}
                        className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                        {/* Show the first image as cover */}
                        <img
                            src={story.images?.[0]}
                            alt={story.title}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4 space-y-3">
                            <h3 className="text-lg font-semibold">{story.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                {story.description}
                            </p>

                            <div className="flex items-center gap-3 mt-2">
                                <img
                                    src={story.createdBy?.photo}
                                    alt={story.createdBy?.name}
                                    className="w-8 h-8 rounded-full border"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-400">
                                    {story.createdBy?.name}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                {user ? (
                                    <FacebookShareButton
                                        url={window.location.origin + "/story/" + story._id}
                                        quote={story.title}
                                        hashtag="#TravelStory"
                                    >
                                        <div className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-indigo-600 hover:text-white transition">
                                            <FacebookIcon size={22} round />
                                            <span>Share</span>
                                        </div>
                                    </FacebookShareButton>
                                ) : (
                                    <button
                                        onClick={() => handleShare(story)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-indigo-600 hover:text-white transition"
                                    >
                                        <FacebookIcon size={22} round />
                                        <span>Share</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
