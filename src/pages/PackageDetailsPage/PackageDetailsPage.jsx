import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Loading from "../shared/Loading/Loading";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import BookingForm from "./BookingForm";
import useAxios from "../../hooks/useAxios";
import GuidesList from "./GuidesList";
import LightGallery from "lightgallery/react";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import PhotoAlbum from "react-photo-album";
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";


const PackageDetailsPage = () => {
    const { id } = useParams();
    // const axiosSecure = useAxiosSecure()
    const axiosInstance = useAxios()
    const [currentPage, setCurrentPage] = React.useState(0);
    const [itemsPerPage, setItemsPerPage] = React.useState(6);

    const { data: guidesData = {}, isLoading: guidesLoading, error: guidesError } = useQuery({
        queryKey: ["guides", currentPage, itemsPerPage],
        queryFn: async () => {
            const res = await axiosInstance.get(
                `/guides/approved?page=${currentPage}&limit=${itemsPerPage}`
            );
            return res.data;
        },
        keepPreviousData: true, // optional: keeps old data while loading new page
    });



    const guides = Array.isArray(guidesData.guides) ? guidesData.guides : [];
    const totalPages = Math.ceil((guidesData.count || 0) / itemsPerPage);

    const { data: allGuides = [] } = useQuery({
        queryKey: ["allGuides"],
        queryFn: async () => {
            const res = await axiosInstance.get("/guides/approved/all");
            return res.data.guides; // all guides for dropdown
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
        <div className="max-w-6xl mx-auto my-12 px-4 pt-4 space-y-10">
            {/* Gallery */}
            <div className="columns-2 sm:columns-2 md:columns-3 gap-2 md:gap-3 p-2">
                {packageData.images.map((img, idx) => (
                    <LightGallery key={idx} speed={500} plugins={[lgThumbnail, lgZoom]}>
                        <a href={img}>
                            <img
                                src={img}
                                alt={`Gallery ${idx}`}
                                loading="lazy"
                                className="w-full mb-4 rounded-lg shadow-md object-cover break-inside-avoid hover:scale-103 transition-transform duration-300"
                            />
                        </a>
                    </LightGallery>
                ))}
            </div>
            


            {/* About & Info */}
            <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4" data-aos="fade-up">
                <h2 className="text-2xl md:text-3xl font-bold mb-2" data-aos="fade-down">{packageData.title}</h2>
                <p className="text-gray-400 mb-4" data-aos="fade-up">{packageData.about}</p>

                {packageData.highlights?.length > 0 && (
                    <div className="mt-4" data-aos="fade-up">
                        <h3 className="text-lg font-semibold mb-2">Highlights:</h3>
                        <div className="flex flex-wrap gap-2">
                            {packageData.highlights.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 shadow-sm"
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 50}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-sm md:text-base font-medium" data-aos="fade-up">
                    <p><span className="font-semibold text-primary">Tour Type:</span> {packageData.tourType}</p>
                    <p><span className="font-semibold text-primary">Location:</span> {packageData.location}</p>
                </div>

                <p data-aos="fade-up">
                    <span className="font-semibold text-primary">Duration:</span>{" "}
                    {packageData.totalDays} {packageData.totalDays > 1 ? "Days" : "Day"}
                </p>

                <div className="md:grid grid-cols-4 pt-2" data-aos="fade-up">
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
            <div className="bg-base-100 p-6 rounded-lg shadow-lg" data-aos="fade-up">
                <h3 className="text-xl text-primary font-semibold mb-4" data-aos="fade-down">Tour Plan</h3>
                <ul className="space-y-2">
                    {packageData.plan.map((day, idx) => (
                        <li key={idx} className="border-l-4 border-primary pl-4" data-aos="fade-right" data-aos-delay={idx * 50}>
                            <span className="font-bold">{day.day}: </span>
                            {day.activity}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Guides */}
            <GuidesList
                guides={guides}
                guidesLoading={guidesLoading}
                guidesError={guidesError}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
            />
            {/* Booking Form */}
            <BookingForm
                packageData={packageData}
                guides={allGuides}
            ></BookingForm>
        </div>
    );
};

export default PackageDetailsPage;
