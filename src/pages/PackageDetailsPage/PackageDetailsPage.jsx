import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../shared/Loading/Loading";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import BookingForm from "./BookingForm";



// const placeholderGuides = [
//     { _id: "1", name: "John Doe", photoURL: "https://via.placeholder.com/150" },
//     { _id: "2", name: "Jane Smith", photoURL: "https://via.placeholder.com/150" },
//     { _id: "3", name: "Ali Khan", photoURL: "https://via.placeholder.com/150" },
// ];

const PackageDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // const [selectedDate, setSelectedDate] = useState(null);
    // const [selectedGuide, setSelectedGuide] = useState("");
    const axiosSecure = useAxiosSecure()


    // Fetch package data
    const { data: packageData, isLoading: packageLoading, error: packageError } = useQuery({
        queryKey: ["package", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/packages/${id}`);
            return res.data;
        },
    });

    const { data: guides = [], isLoading: guidesLoading, error: guidesError } = useQuery({
        queryKey: ["guides"],
        queryFn: async () => {
            const res = await axiosSecure.get("/guides/approved");
            return res.data;
        },
    });


    React.useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    if (packageLoading) return <Loading />;
    if (packageError) return <p>Error loading package!</p>;

    // {
    //     guidesLoading ? (
    //         <Loading />
    //     ) : guides.length === 0 ? (
    //         <p>No guides available</p>
    //     ) : (
    //         guides.map(guide => <div key={guide._id}>{guide.name}</div>)
    //     )
    // }
    {
        guidesError && (
            <p className="text-red-500">Failed to load guides: {guidesError.message}</p>
        )
    }


    // const handleBooking = () => {
    //     if (!selectedDate || !selectedGuide) {
    //         alert("Please select a tour date and guide");
    //         return;
    //     }
    //     alert(`Booking confirmed for ${packageData.title} with guide ${selectedGuide}`);
    // };

    return (
        <div className="max-w-6xl mx-auto my-12 px-4 pt-4 space-y-10">{/* About & Info */}


            {/* Gallery */}
            <div className="columns-2 md:columns-3 gap-2 md:gap-4" data-aos="fade-up">
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
            <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4" data-aos="fade-up">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{packageData.title}</h2>

                {/* About */}
                <p className="text-gray-400 mb-4">{packageData.about}</p>

                {packageData.highlights?.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Highlights:</h3>
                        <div className="flex flex-wrap gap-2">
                            {packageData.highlights.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm"                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm md:text-base font-medium">
                    <p><span className="font-semibold text-primary">Tour Type:</span> {packageData.tourType}</p>
                    <p><span className="font-semibold text-primary">Location:</span> {packageData.location}</p>
                    <p><span className="font-semibold text-primary">Duration:</span> {packageData.duration}</p>
                    <p><span className="font-semibold text-primary">Group Size:</span> {packageData.groupSize}</p>
                    <p><span className="font-semibold text-primary">Start date:</span> {packageData.startDate}</p>
                    <p><span className="font-semibold text-primary">End date:</span> {packageData.endDate}</p>
                </div>



                {/* Highlights */}


                <div className="md:grid grid-cols-4 pt-2">
                    {/* Inclusions */}
                    {packageData.inclusions?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Inclusions:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
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
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                {packageData.exclusions.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
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

            <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
                <h3 className="text-2xl font-semibold mb-6 text-center">Available Tour Guides</h3>

                {guidesLoading ? (
                    <div className="flex justify-center py-12">
                        <Loading />
                    </div>
                ) : guidesError ? (
                    <p className="text-center text-red-500">Failed to load guides</p>
                ) : guides.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">No guides available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {guides.map((guide) => (
                            <div
                                key={guide._id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
                            >
                                <img
                                    src={guide.photoURL || "https://via.placeholder.com/150"}
                                    alt={guide.name}
                                    className="w-28 h-28 object-cover rounded-full mb-4 border-2 border-gray-200 dark:border-gray-600"
                                />
                                <p className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">{guide.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{guide.district || "N/A"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    Experience: {guide.experience || "N/A"} yrs
                                </p>
                                <button
                                    className="btn btn-secondary btn-sm mt-auto w-full"
                                    onClick={() => navigate(`/guides/${guide._id}`)}
                                >
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Booking Form */}
            <BookingForm packageData={packageData} guides={guides}></BookingForm>
            {/* <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
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
            </div> */}
        </div>
    );
};

export default PackageDetailsPage;
