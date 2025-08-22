import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";

const BeAGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.photoURL || "");

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    experience: "",
    age: "",
    status: "pending",
    bio: "",
    created_at: new Date().toISOString(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", photoFile);

      const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
      const res = await axiosInstance.post(imagUploadUrl, formData);

      setProfilePic(res.data.data.url);
      Swal.fire("Success!", "Photo uploaded successfully.", "success");
      setPhotoFile(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to upload photo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!profilePic) {
        Swal.fire("Warning", "Please upload a photo first.", "warning");
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit your application as a Tour Guide?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const payload = { ...formData, userId: user?.uid, photoURL: profilePic };
          const res = await axiosInstance.post("/guides", payload);

          if (res?.data?.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Application Submitted",
              text: "Your application is pending. Admin will review it soon.",
              confirmButtonText: "OK",
            }).then(() => navigate("/dashboard"));
          }
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to submit application", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Apply as a Tour Guide</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-start gap-2">
          {profilePic ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={profilePic}
                alt={user?.displayName || "Profile"}
                className="w-32 h-32 object-cover rounded-full shadow-md"
              />
              <label className="btn btn-sm btn-outline cursor-pointer">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              {photoFile && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleUploadPhoto}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload New Photo"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-2">
              <input type="file" accept="image/*" onChange={handlePhotoChange} />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleUploadPhoto}
                disabled={uploading || !photoFile}
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          )}
        </div>


        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            className="input input-bordered w-full bg-base-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="input input-bordered w-full bg-base-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Optional"
          />
        </div>


        <div>
          <label className="block font-semibold">National ID Card Number</label>
          <input

            type="text"
            name="nid"
            value={formData.nid}
            required
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Card Number"
          />
        </div>

        <div>
          <label className="block font-semibold">Phone</label>
          <input

            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block font-semibold">District</label>
          <input
            type="text"
            name="district"
            required
            value={formData.district}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="District name"
          />
        </div>

        <div>
          <label className="block font-semibold">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block font-semibold">Bio / Introduction</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Tell us about yourself"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeAGuide;
