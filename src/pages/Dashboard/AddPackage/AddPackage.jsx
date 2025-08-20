import { useForm, useFieldArray } from "react-hook-form"; // CHANGED - useFieldArray for dynamic plan
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import { useState } from "react";

const AddPackage = () => {
    const { register, handleSubmit, reset, control } = useForm();
    const axiosSecure = useAxiosSecure();
    const [pictures, setPictures] = useState([]); // CHANGED - now an array for multiple images

    // react-hook-form field array for Tour Plan (accordion-like data)
    const { fields, append, remove } = useFieldArray({
        control,
        name: "plan", // this will be sent as array of objects
    });

    const onSubmit = async (data) => {
        try {
            data.price = parseFloat(data.price);
            console.log(data);

            // attach uploaded images
            data.images = pictures;

            // plan will already be array from useFieldArray
            const res = await axiosSecure.post("/packages", data);

            if (res.data.insertedId) {
                Swal.fire({
                    title: "Success!",
                    text: "Package added successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
                // reset();
                setPictures([]); // reset images
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "Error!",
                text: err.message,
                icon: "error",
            });
        }
    };

    // handle multiple image upload
    const handleImageUpload = async (e) => {
        const files = e.target.files; // CHANGED - multiple files
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append("image", files[i]);

            const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key
                }`;

            const res = await axios.post(imagUploadUrl, formData);
            uploadedUrls.push(res.data.data.url);
        }

        setPictures([...pictures, ...uploadedUrls]); // add to state
    };

    return (
        <div className="max-w-2xl mx-auto my-10 p-6 bg-base-200 shadow-xl rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Add New Package</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Trip Title */}
                <input
                    type="text"
                    placeholder="Trip Title"
                    {...register("title", { required: true })}
                    className="input input-bordered w-full"
                />

                {/* Tour Type as Dropdown - CHANGED */}
                <select
                    {...register("tourType", { required: true })}
                    className="select select-bordered w-full"
                >
                    <option value="">Select Tour Type</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Historical">Historical</option>
                    <option value="Religious">Religious</option>
                    <option value="Nature">Nature</option>
                </select>

                {/* Price */}
                <input
                    type="number"
                    placeholder="Price"
                    {...register("price", { required: true })}
                    className="input input-bordered w-full"
                />

                {/* About Tour */}
                <textarea
                    placeholder="About the Tour"
                    {...register("about", { required: true })}
                    className="textarea textarea-bordered w-full"
                ></textarea>

                {/* Tour Plan with dynamic fields (accordion data) - CHANGED */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Tour Plan (Day-wise)</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center">
                            <input
                                {...register(`plan.${index}.day`, { required: true })}
                                placeholder="Day (e.g. Day 1)"
                                className="input input-bordered w-1/3"
                            />
                            <input
                                {...register(`plan.${index}.activity`, { required: true })}
                                placeholder="Activity details"
                                className="input input-bordered w-2/3"
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
                        onClick={() => append({ day: "", activity: "" })}
                        className="btn btn-outline btn-primary btn-sm"
                    >
                        + Add Day
                    </button>
                </div>

                {/* Multiple Image Upload - CHANGED */}
                <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="file-input file-input-bordered w-full"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {pictures.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt="preview"
                            className="w-20 h-20 object-cover rounded"
                        />
                    ))}
                </div>

                <button type="submit" className="btn btn-primary w-full">
                    Add Package
                </button>
            </form>
        </div>
    );
};

export default AddPackage;
