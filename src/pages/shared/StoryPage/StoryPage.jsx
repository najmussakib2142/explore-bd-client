import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { format } from "date-fns";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Using react-icons for the back button
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import Loading from "../Loading/Loading";

export default function StoryPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get the current path
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [likeLoading, setLikeLoading] = useState(false);

    const { data: story, isLoading } = useQuery({
        queryKey: ["story", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/stories/${id}`);
            return res.data;
        },
    });

    const likeMutation = useMutation({
        mutationFn: async ({ storyId, userId }) => {
            const res = await axiosInstance.patch(`/stories/${storyId}/like`, { userId });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["story", id], (oldData) => ({
                ...oldData,
                likes: data.likes,
            }));
            setLikeLoading(false);
        },
        onError: () => setLikeLoading(false),
    });

    // 1. Redirect to login with current location state
    const handleProtectedAction = (e) => {
        if (!user) {
            // Passing the current path to the login page via 'state'
            navigate("/login", { state: { from: location.pathname } });
            return false;
        }
        return true;
    };

    const handleLike = () => {
        if (!handleProtectedAction()) return;
        const userId = user._id || user.uid || user.email;
        setLikeLoading(true);
        likeMutation.mutate({ storyId: id, userId });
    };

    const hasLiked = story?.likes?.includes(user?._id || user?.uid || user?.email);

    if (isLoading || !story) return <Loading />;

    return (
        <section className="max-w-5xl mx-auto py-12 px-4 md:px-8">
            <Helmet>
                <title>{story.title} | ExploreBD</title>
                <meta property="og:title" content={story.title} />
                <meta property="og:description" content={story.description} />
                <meta property="og:image" content={story.images?.[0]} />
                <meta property="og:url" content={`${window.location.origin}/story/${story._id}`} />
            </Helmet>

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition mb-6 group"
            >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Go Back</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">{story.title}</h1>
                <div className="flex items-center gap-4">
                    <img src={story.createdBy?.photo} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <div>
                        <p className="font-semibold">{story.createdBy?.name}</p>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">{story.createdBy?.role}</p>
                    </div>
                </div>
            </div>

            {/* Images and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {story.images?.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-80 object-cover rounded-2xl shadow-md" />
                ))}
            </div>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-10">{story.description}</p>

            {/* Like and Share Actions */}
            <div className="flex items-center gap-4 py-8 border-t border-gray-100">

                {/* Like Button */}
                <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${hasLiked
                        ? "bg-red-50 text-red-500 border border-red-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {hasLiked ? "❤️" : "🤍"} {story.likes?.length || 0}
                </button>

                {/* Share Logic with Redirect check */}
                {user ? (
                    <FacebookShareButton
                        url={`${window.location.origin}/story/${story._id}`}
                        quote={story.title}
                        hashtag="#TravelStory"
                    >
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:border-blue-400 text-blue-600 transition">
                            <FacebookIcon size={24} round />
                            <span className="font-medium">Share</span>
                        </div>
                    </FacebookShareButton>
                ) : (
                    <button
                        onClick={handleProtectedAction}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500"
                    >
                        <FacebookIcon size={24} round />
                        <span className="font-medium">Login to Share</span>
                    </button>
                )}
            </div>
        </section>
    );
}