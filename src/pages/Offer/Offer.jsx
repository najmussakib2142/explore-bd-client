import React from "react";
import { FaGift } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const Offer = () => {
    const { user } = useAuth();
    const navigate = useNavigate()

    return (
        <div className="min-h-[60vh] flex flex-col justify-center items-center text-center p-6">
            {!user ? (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                    <FaGift className="text-6xl text-indigo-500 dark:text-pink-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                        Welcome to Offers
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Please <span className="font-semibold">login</span> to see if you are eligible for special offers.
                    </p>
                    <button
                        onClick={() => {navigate("/login") }}
                        className="px-6 cursor-pointer py-2 bg-indigo-600 dark:bg-pink-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-pink-600 transition"
                    >
                        Login
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full">
                    <FaGift className="text-6xl text-indigo-500 dark:text-pink-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                        No Offers Yet
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Hello {user.displayName || user.email}, you currently have no offers. <br />
                        If you become eligible, we will notify you here or via email.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Offer;
