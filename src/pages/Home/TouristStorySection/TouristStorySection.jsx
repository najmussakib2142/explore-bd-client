import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { GoArrowRight } from "react-icons/go";
import Skeleton from "../../shared/Skeleton/Skeleton";

export default function TouristStorySection() {
    const axiosInstance = useAxios();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: stories = [], isLoading } = useQuery({
        queryKey: ["stories", "random"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stories/random");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <section className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-[#f0fdf4] dark:bg-[#1e293b] rounded-2xl p-4 animate-pulse"
                        >
                            <Skeleton width="full" height="40" className="mb-4" />
                            <Skeleton width="full" height="6" className="mb-2" />
                            <Skeleton width="3/4" height="4" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    const handleShare = () => {
        if (!user) navigate("/login");
    };

    return (
        <section className="max-w-7xl mx-auto sm:py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16">
            <div
                className="flex items-center justify-between mb-8"
                data-aos="fade-down"
            >
                <h2 className="text-3xl md:text-4xl font-bold">Tourist Stories</h2>
                <button
                    onClick={() => navigate("/communityPage")}
                    className="px-4 py-2 flex items-center gap-1 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    All Stories <GoArrowRight />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stories.map((story, index) => (
                    <motion.div
                        key={story._id}
                        whileHover={{
                            scale: 1.03,
                            boxShadow: "0px 15px 30px rgba(0,0,0,0.2)",
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                        className="bg-[#f0fdf4] dark:bg-[#1e293b] rounded-2xl overflow-hidden cursor-pointer"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <motion.img
                            src={story.images?.[0]}
                            alt={story.title}
                            className="w-full h-40 object-cover"
                            whileHover={{ y: -6 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        />

                        <div className="p-4 space-y-3">
                            <h3 className="text-lg font-semibold line-clamp-1">
                                {story.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                {story.description}
                            </p>

                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2">
                                    {story.createdBy?.photo ? (
                                        <img
                                            src={story.createdBy.photo}
                                            alt={story.createdBy?.name || "User"}
                                            className="w-8 h-8 rounded-full border"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            {story.createdBy?.name?.[0] || "?"}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-400">
                                        {story.createdBy?.name || "Unknown"}
                                    </span>
                                </div>

                                {user ? (
                                    <FacebookShareButton
                                        url={window.location.origin + "/story/" + story._id}
                                        quote={story.title}
                                        hashtag="#TravelStory"
                                    >
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 hover:border-primary transition">
                                            <FacebookIcon size={22} round />
                                            <span>Share</span>
                                        </div>
                                    </FacebookShareButton>
                                ) : (
                                    <button
                                        onClick={handleShare(story)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 hover:border-primary transition"
                                    >
                                        <FacebookIcon size={22} round />
                                        <span>Share</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
