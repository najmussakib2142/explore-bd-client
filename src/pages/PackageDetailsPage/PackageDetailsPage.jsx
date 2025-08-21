import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../shared/Loading/Loading";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";



const placeholderGuides = [
    { _id: "1", name: "John Doe", photoURL: "https://via.placeholder.com/150" },
    { _id: "2", name: "Jane Smith", photoURL: "https://via.placeholder.com/150" },
    { _id: "3", name: "Ali Khan", photoURL: "https://via.placeholder.com/150" },
];

const PackageDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedGuide, setSelectedGuide] = useState("");
    const axiosSecure = useAxiosSecure()


    // Fetch package data
    const { data: packageData, isLoading, error } = useQuery({
        queryKey: ["package", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/packages/${id}`);
            return res.data;
        },
    });

    // Guides (placeholder until your DB exists)
    const { data: guides = placeholderGuides } = useQuery({
        queryKey: ["guides"],
        queryFn: async () => {
            return placeholderGuides;
        },
    });

    React.useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    if (isLoading) return (<Loading></Loading>);
    if (error) return <p className="text-center mt-10">Error loading package!</p>;


    const handleBooking = () => {
        if (!selectedDate || !selectedGuide) {
            alert("Please select a tour date and guide");
            return;
        }
        alert(`Booking confirmed for ${packageData.title} with guide ${selectedGuide}`);
    };

    return (
        <div className="max-w-6xl mx-auto my-12 px-4 pt-4 space-y-10">{/* About & Info */}


            {/* Gallery */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-aos="fade-up">
                {packageData.images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`Gallery ${idx}`}
                        className="w-full h-64 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                    />
                ))}
            </div> */}
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4" data-aos="fade-up">
                {packageData.images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`Gallery ${idx}`}
                        // loading="lazy"
                        className="w-full  object-cover rounded-lg shadow-md mb-4 break-inside-avoid hover:scale-105 transition-transform duration-300"
                    />
                ))}
            </div>



            {/* About & Info */}
            <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-6" data-aos="fade-up">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{packageData.title}</h2>

                {/* About */}
                <p className="text-gray-700 mb-4">{packageData.about}</p>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base font-medium">
                    <p><span className="font-semibold text-primary">Tour Type:</span> {packageData.tourType}</p>
                    <p><span className="font-semibold text-primary">Location:</span> {packageData.location}</p>
                    <p><span className="font-semibold text-primary">Duration:</span> {packageData.duration}</p>
                    <p><span className="font-semibold text-primary">Group Size:</span> {packageData.groupSize}</p>
                </div>

                {/* Highlights */}
                {packageData.highlights?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Highlights:</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {packageData.highlights.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Inclusions */}
                {packageData.inclusions?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Inclusions:</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {packageData.inclusions.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Exclusions */}
                {packageData.exclusions?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Exclusions:</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {packageData.exclusions.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>



            {/* Tour Plan */}
            <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-4">Tour Plan</h3>
                <ul className="space-y-2">
                    {packageData.plan.map((day, idx) => (
                        <li key={idx} className="border-l-4 border-primary pl-4">
                            <span className="font-bold">{day.day}: </span>
                            {day.activity}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Guides */}
            <div className="bg-base-200 p-6 rounded-lg shadow-lg" data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-4">Available Tour Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {guides.map((guide) => (
                        <div
                            key={guide._id}
                            className="bg-base-100 rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-xl transition"
                        >
                            <img
                                src={guide.photoURL}
                                alt={guide.name}
                                className="w-24 h-24 object-cover rounded-full mb-2"
                            />
                            <p className="font-semibold">{guide.name}</p>
                            <button
                                className="btn btn-secondary btn-sm mt-2"
                                onClick={() => navigate(`/guides/${guide._id}`)}
                            >
                                Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Form */}
            <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
                <h3 className="text-xl font-semibold mb-4">Book This Package</h3>
                <div className="space-y-4">
                    <p><span className="font-semibold">Package:</span> {packageData.title}</p>
                    <p><span className="font-semibold">Price:</span> BDT {packageData.price}</p>

                    <label className="block font-semibold">Select Tour Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="input input-bordered w-full"
                    />

                    <label className="block font-semibold">Select Tour Guide</label>
                    <select
                        value={selectedGuide}
                        onChange={(e) => setSelectedGuide(e.target.value)}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Guide</option>
                        {guides.map((guide) => (
                            <option key={guide._id} value={guide.name}>
                                {guide.name}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn btn-primary w-full"
                        onClick={handleBooking}
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageDetailsPage;
