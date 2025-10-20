import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FacebookShareButton, FacebookIcon } from "react-share";
import { useSprings, animated } from '@react-spring/web';
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { GoArrowRight } from "react-icons/go";

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

    const [hoveredIndex, setHoveredIndex] = useState(null);

    // React Spring springs for cards + image lift
    const springs = useSprings(
        stories.length,
        stories.map((_, index) => ({
            transform: hoveredIndex === index ? "scale(1.03)" : "scale(1)",
            boxShadow:
                hoveredIndex === index
                    ? "0px 15px 30px rgba(0,0,0,0.2)"
                    : "0px 5px 15px rgba(0,0,0,0.1)",
            config: { mass: 1, tension: 210, friction: 20 },
        }))
    );

    // Subtle image lift springs
    const imageSprings = useSprings(
        stories.length,
        stories.map((_, index) => ({
            transform: hoveredIndex === index ? "translateY(-6px)" : "translateY(0px)",
            config: { mass: 1, tension: 200, friction: 18 },
        }))
    );

    const handleShare = () => {
        if (!user) navigate("/login");
    };

    return (
        <section className="max-w-7xl mx-auto py-10 px-3 md:px-8">
            <div className="flex items-center justify-between mb-6" data-aos="fade-down">
                <h2 className="text-3xl font-bold">Tourist Stories</h2>
                <button
                    onClick={() => navigate("/communityPage")}
                    className="px-4 cursor-pointer py-2 flex items-center gap-0.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    All Stories<GoArrowRight />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stories.map((story, index) => (
                    <animated.div
                        key={story._id}
                        style={springs[index]}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="bg-[#f0fdf4] dark:bg-[#1e293b] border-gray-600 dark:border-gray-700 rounded-2xl overflow-hidden cursor-pointer"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                    >
                        <animated.img
                            src={story.images?.[0]}
                            alt={story.title}
                            style={imageSprings[index]}
                            className="w-full h-40 object-cover"
                        />

                        <div className="p-4 space-y-3">
                            <h3 className="text-lg font-semibold line-clamp-1">{story.title}</h3>
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
                                        <div className="w-8 h-8 rounded-full border bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold">
                                            {story.createdBy?.name?.[0] || "?"}
                                        </div>
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-400">
                                        {story.createdBy?.name || "Unknown"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2  text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer">
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
                    </animated.div>
                ))}
            </div>
        </section>
    );
}
