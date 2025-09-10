import React from "react";
import { useNavigate } from "react-router";
import { FaRocket, FaExclamationTriangle } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 text-white px-4">
            <Helmet>
                <title>404 | Page Not Found - ExploreBD</title>
                <meta
                    name="description"
                    content="Oops! The page you are looking for on ExploreBD does not exist. Return to our homepage to discover the best travel destinations in Bangladesh."
                />
            </Helmet>
            <FaExclamationTriangle className="text-9xl animate-pulse mb-5" />
            <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500 animate-fadeIn">
                404
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-center  animate-fadeIn delay-100 max-w-lg">
                Oops! The page you are looking for seems to have drifted into a black hole. 🚀
            </p>

            <button
                onClick={() => navigate("/")}
                className="flex animate-fadeIn delay-200 items-center gap-2 bg-white text-purple-600 dark:bg-purple-600 dark:text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
                <FaRocket /> Back to Home
            </button>

            {/* Fun floating stars */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-1 h-1 bg-white rounded-full absolute animate-bounce"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ErrorPage;
