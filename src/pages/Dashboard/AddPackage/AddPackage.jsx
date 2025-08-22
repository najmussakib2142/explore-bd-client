import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
// import axios from "axios";
import { FaTimes, FaSpinner } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddPackage = () => {
    const axiosSecure = useAxiosSecure();

    const { register, handleSubmit, control, setValue, reset } = useForm({
        defaultValues: {
            plan: [{ day: "Day 1", activity: "" }],
            inclusions: [],
            exclusions: [],
        },
    });

    // Dynamic itinerary (plan)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "plan",
    });

    // Dates + duration derived state
    const [startDate, setStartDate] = useState(null); // JS Date
    const [endDate, setEndDate] = useState(null);     // JS Date
    const [duration, setDuration] = useState("");

    // Images
    const [pictures, setPictures] = useState([]); // array of URLs
    const [uploading, setUploading] = useState(false);

    // Helpers
    const fmt = (d) => (d ? d.toISOString().split("T")[0] : "");

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);

        // Persist raw values to form (ISO yyyy-mm-dd)
        setValue("startDate", fmt(start));
        setValue("endDate", fmt(end));

        if (start && end) {
            if (end < start) {
                setDuration("");
                setValue("duration", "");
                return;
            }
            const diffTime = end.setHours(12, 0, 0, 0) - start.setHours(12, 0, 0, 0); // avoid DST edge cases
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dur = `${diffDays} Days / ${Math.max(diffDays - 1, 0)} Nights`;
            setDuration(dur);
            setValue("duration", dur);
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files?.length) return;

        setUploading(true);
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("image", files[i]);

            const uploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

            try {
                const res = await axiosSecure.post(uploadUrl, formData);
                uploadedUrls.push(res.data?.data?.url);
            } catch (err) {
                console.error("Image upload failed:", err);
                Swal.fire("Upload failed", err?.message || "Please try again", "error");
            }
        }

        setPictures((prev) => [...prev, ...uploadedUrls.filter(Boolean)]);
        setUploading(false);
        // Reset the input so selecting the same files again still triggers onChange
        e.target.value = "";
    };

    const handleDelete = (index) => {
        setPictures((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        try {
            // Normalize
            data.price = parseFloat(data.price);
            data.images = pictures;

            // Convert highlights (comma separated) -> array
            if (data.highlights && typeof data.highlights === "string") {
                data.highlights = data.highlights
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
            // Confirmation before submit
            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to add this package?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, Add it",
                cancelButtonText: "Cancel",
            });

            if (!confirm.isConfirmed) return;

            // Guard: require at least one image?
            if (!data.images?.length) {
                const ok = await Swal.fire({
                    icon: "warning",
                    title: "No images added",
                    text: "Are you sure you want to submit without any images?",
                    showCancelButton: true,
                    confirmButtonText: "Yes, submit",
                });
                if (!ok.isConfirmed) return;
            }

            // Submit
            const res = await axiosSecure.post("/packages", data);

            if (res?.data?.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Package added successfully.",
                    icon: "success",
                    timer: 1800,
                    showConfirmButton: false,
                });

                // reset({
                //     plan: [{ day: "Day 1", activity: "" }],
                //     inclusions: [],
                //     exclusions: [],
                // });
                reset()
                
                setPictures([]);
                setStartDate(null);
                setEndDate(null);
                setDuration("");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", err?.message || "Something went wrong", "error");
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-10 p-6 bg-base-100 shadow-xl rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Package</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="font-semibold mb-1 block">Tour Title</label>
                    <input
                        type="text"
                        {...register("title", { required: true })}
                        className="input input-bordered w-full"
                        placeholder="e.g. Bandarban Hill Adventure"
                    />
                </div>

                {/* Tour Type */}
                <div>
                    <label className="font-semibold mb-1 block">Tour Type</label>
                    <select
                        {...register("tourType", { required: true })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Type</option>
                        <option value="Nature">Nature</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Historical">Historical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Beach">Beach</option>
                    </select>
                </div>

                {/* Location */}
                <div>
                    <label className="font-semibold mb-1 block">Location</label>
                    <input
                        type="text"
                        placeholder="e.g. Bandarban, Bangladesh"
                        {...register("location", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>
                <div>
                    <label className="font-semibold mb-1 block">Meeting Point</label>
                    <input
                        type="text"
                        placeholder="e.g. Kalabagan, Dhaka"
                        {...register("meetingPoint", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* Dates + Duration */}
                <div>
                    <label className="font-semibold mb-1 block">Event Dates</label>
                    <div className="flex flex-col md:flex-row gap-3">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => handleDateChange(date, endDate)}
                            placeholderText="Start Date"
                            className="input input-bordered w-full"
                            dateFormat="yyyy-MM-dd"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => handleDateChange(startDate, date)}
                            placeholderText="End Date"
                            className="input input-bordered w-full"
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate || undefined}
                        />
                    </div>
                    {endDate && startDate && endDate < startDate && (
                        <p className="text-error text-sm mt-1">End date cannot be before start date.</p>
                    )}
                    {duration && (
                        <p className="mt-1  text-blue-400 opacity-80">
                            Duration: <span className="font-medium ">{duration}</span>
                        </p>
                    )}
                    {/* Hidden fields to submit dates/duration */}
                    <input type="hidden" {...register("startDate")} value={fmt(startDate)} readOnly />
                    <input type="hidden" {...register("endDate")} value={fmt(endDate)} readOnly />
                    <input type="hidden" {...register("duration")} value={duration} readOnly />
                </div>

                {/* Group Size */}
                <div>
                    <label className="font-semibold mb-1 block">Group Size</label>
                    <select
                        {...register("groupSize", { required: true })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Group Size</option>
                        <option value="1-5">1 - 5 People</option>
                        <option value="6-10">6 - 10 People</option>
                        <option value="11-20">11 - 20 People</option>
                        <option value="21+">21+ People</option>
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="font-semibold mb-1 block">Price (BDT)</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        placeholder="e.g. 22000"
                        {...register("price", { required: true })}
                        className="input input-bordered w-full"
                    />
                </div>

                {/* About */}
                <div>
                    <label className="font-semibold mb-1 block">About the Tour</label>
                    <textarea
                        placeholder="Brief description of the tour..."
                        {...register("about", { required: true })}
                        className="textarea textarea-bordered w-full"
                        rows={4}
                    />
                </div>

                {/* Highlights (CSV to Array) */}
                <div>
                    <label className="font-semibold mb-1 block">Highlights (comma-separated)</label>
                    <textarea
                        placeholder="e.g. Nilgiri viewpoint, Nafakhum waterfall, Tribal culture"
                        {...register("highlights")}
                        className="textarea textarea-bordered w-full"
                        rows={2}
                    />
                </div>

                {/* Inclusions (multi-select dropdown) */}
                <div className="grid md:grid-cols-3 gap-5">
                    <div>
                        <label className="font-semibold mb-1 block">Inclusions</label>
                        <div className="space-y-2">
                            {[
                                "Accommodation",
                                "Meals",
                                "Transport",
                                "Tour Guide",
                                "Entry Tickets",
                                "Photography",
                            ].map((item) => (
                                <label key={item} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={item}
                                        {...register("inclusions")}
                                        className="checkbox"
                                    />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Exclusions (multi-select dropdown) */}
                    <div>
                        <label className="font-semibold mb-1 block">Exclusions</label>
                        <div className="space-y-2">
                            {[
                                "Personal Expenses",
                                "Tips",
                                "Insurance",
                                "Restaurant Bills",
                                "Visa",
                            ].map((item) => (
                                <label key={item} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={item}
                                        {...register("exclusions")}
                                        className="checkbox"
                                    />
                                    <span>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Itinerary (Plan) */}
                <div>
                    <label className="font-semibold mb-2 block">Tour Plan (Itinerary)</label>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Day ${index + 1}`}
                                    {...register(`plan.${index}.day`, { required: true })}
                                    className="input input-bordered w-1/4"
                                />
                                <input
                                    type="text"
                                    placeholder="Activity details"
                                    {...register(`plan.${index}.activity`, { required: true })}
                                    className="input input-bordered w-3/4"
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="btn btn-error btn-sm"
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => append({ day: `Day ${fields.length + 1}`, activity: "" })}
                            className="btn btn-outline btn-primary btn-sm"
                        >
                            + Add Day
                        </button>
                    </div>
                </div>

                {/* Images */}
                <div>
                    <label className="font-semibold mb-1 block">Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered w-full"
                        accept="image/*"
                    />

                    {/* Loader */}
                    {uploading && (
                        <div className="flex items-center gap-2 mt-2">
                            <FaSpinner className="animate-spin" />
                            <span>Uploading...</span>
                        </div>
                    )}

                    {/* Previews */}
                    {!!pictures.length && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {pictures.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={img}
                                        alt={`package-${idx}`}
                                        className="w-24 h-24 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(idx)}
                                        className="absolute -top-2 -right-2 bg-black bg-opacity-60 text-white p-1 rounded-full hover:bg-red-600"
                                        aria-label="Remove image"
                                        title="Remove image"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                    {uploading ? "Please wait..." : "Add Package"}
                </button>
            </form>
        </div>
    );
};

export default AddPackage;
