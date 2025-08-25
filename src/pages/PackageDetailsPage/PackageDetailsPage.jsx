import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Loading from "../shared/Loading/Loading";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import BookingForm from "./BookingForm";
import useAxios from "../../hooks/useAxios";
import GuidesList from "./GuidesList";
// import useAxiosSecure from "../../hooks/useAxiosSecure";


const PackageDetailsPage = () => {
    const { id } = useParams();
    // const axiosSecure = useAxiosSecure()
    const axiosInstance = useAxios()

    const { data: guides = [], isLoading: guidesLoading, error: guidesError } = useQuery({
        queryKey: ["guides"],
        queryFn: async () => {
            const res = await axiosInstance.get("/guides/approved");
            return res.data;
        },
    });

    // Fetch package data
    const { data: packageData, isLoading: packageLoading, error: packageError } = useQuery({
        queryKey: ["package", id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/packages/${id}`);
            return res.data;
        },
    });



    React.useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    if (packageLoading) return <Loading />;
    if (packageError) return <p className="text-red-500 text-center py-7">Error loading package!</p>;


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
                            <h3 className="text-lg font-semibold mb-">Inclusions:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                {packageData.inclusions.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Exclusions */}
                    {packageData.exclusions?.length > 0 && (
                        <div className="mt-2">
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
            <div className="bg-base-100  p-6 rounded-lg shadow-lg" data-aos="fade-up">
                <h3 className="text-xl text-primary font-semibold mb-4">Tour Plan</h3>
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
            <GuidesList guides={guides} guidesLoading={guidesLoading} guidesError={guidesError}></GuidesList>

            {/* Booking Form */}
            <BookingForm packageData={packageData} guides={guides}></BookingForm>

        </div>
    );
};

export default PackageDetailsPage;
