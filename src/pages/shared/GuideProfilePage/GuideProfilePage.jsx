import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import useAxios from "../../../hooks/useAxios";

const GuideProfilePage = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchGuide = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/guides/approved");
            // Find the guide by id
            const guideData = res.data.find((g) => g._id === id);
            setGuide(guideData || null);
        } catch (err) {
            console.error(err);
            setGuide(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center items-center py-20 text-green-600">
                <FaSpinner className="animate-spin mr-2" /> Loading guide profile...
            </div>
        );

    if (!guide)
        return (
            <div className="text-center py-20 text-gray-500">
                Guide not found.
            </div>
        );

    return (
        <div className="max-w-4xl mx-auto my-12 p-4">
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
                    <p className="text-gray-500 mb-2">Region: {guide.district}</p>
                    <p className="text-gray-500 mb-2">Experience: {guide.experience || "N/A"} yrs</p>
                    <p className="text-gray-500 mb-2">Age: {guide.age || "N/A"}</p>
                    <p className="text-gray-500 mb-2">Phone: {guide.phone || "N/A"}</p>
                    <p className="text-gray-500 mb-2">Bio: {guide.bio || "No introduction provided."}</p>

                    {/* TODO: Stories Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-2">Stories</h3>
                        <p className="text-gray-400">No stories added yet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideProfilePage;
