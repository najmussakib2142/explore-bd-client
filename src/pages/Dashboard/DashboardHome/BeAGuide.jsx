import React, { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaSpinner } from "react-icons/fa";

const BeAGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure()
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.photoURL || "");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    experience: "",
    age: "",
    status: "pending",
    bio: "",
    cv: "",
    district: "",
    nid: "",
    created_at: new Date().toISOString(),
  });

  // console.log(formData, setFormData);

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
    } catch {
      // console.error(err);
      Swal.fire("Error!", "Failed to upload photo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profilePic) {
      Swal.fire("Warning", "Please upload a photo first.", "warning");
      return;
    }

    try {
      setSubmitting(true); // start loading

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit your application as a Tour Guide?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit",

      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Submitting...",
          text: "Please wait while we process your application",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const payload = { ...formData, userId: user?.uid, photoURL: profilePic };
        const res = await axiosSecure.post("/guides", payload);

        Swal.close();

        if (res?.data?.insertedId) {
          await Swal.fire({
            icon: "success",
            title: "Application Submitted",
            text: "Your application is pending. Admin will review it soon.",
            confirmButtonText: "OK",
          });
          navigate("/dashboard");
        }
      }
    } catch (err) {
      Swal.close();
      // console.error(err);
      Swal.fire("Error", err.message || "Failed to submit application", "error");
    } finally {
      setSubmitting(false); // stop loading here, after submission
    }
  };


  return (
    <div className="max-w-xl mx-auto bg-base-100 p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Apply as a Tour Guide</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-start gap-2">
          {profilePic ? (
            <div className="flex  flex-col items-center gap-2">
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

              <input type="file" className="file-input file-input-bordered w-full text-base font-medium" accept="image/*" onChange={handlePhotoChange} />

              <button
                type="button"
                className="btn btn-primary btn-sm flex items-center gap-2"
                onClick={handleUploadPhoto}
                disabled={uploading || !photoFile}
              >
                {uploading && <FaSpinner className="animate-spin" />}
                {uploading ? "Uploading..." : profilePic ? "Upload New Photo" : "Upload Photo"}
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
            className="input text-primary cursor-not-allowed input-bordered w-full bg-base-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="input text-primary cursor-not-allowed input-bordered w-full bg-base-100"
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
            placeholder="ID Number"
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
          <label className="block font-semibold mb-1">District</label>
          <select
            name="district"
            required
            value={formData.district}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Khulna">Khulna</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Barishal">Barishal</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Mymensingh">Mymensingh</option>
            <option value="Bagerhat">Bagerhat</option>
            <option value="Bandarban">Bandarban</option>
            <option value="Barguna">Barguna</option>
            <option value="Bhola">Bhola</option>
            <option value="Bogra">Bogra</option>
            <option value="Brahmanbaria">Brahmanbaria</option>
            <option value="Chandpur">Chandpur</option>
            <option value="Chuadanga">Chuadanga</option>
            <option value="Comilla">Comilla</option>
            <option value="Cox's Bazar">Cox's Bazar</option>
            <option value="Dinajpur">Dinajpur</option>
            <option value="Faridpur">Faridpur</option>
            <option value="Feni">Feni</option>
            <option value="Gaibandha">Gaibandha</option>
            <option value="Gazipur">Gazipur</option>
            <option value="Gopalganj">Gopalganj</option>
            <option value="Habiganj">Habiganj</option>
            <option value="Jamalpur">Jamalpur</option>
            <option value="Jashore">Jashore</option>
            <option value="Jhalokati">Jhalokati</option>
            <option value="Jhenaidah">Jhenaidah</option>
            <option value="Joypurhat">Joypurhat</option>
            <option value="Junk">Junk</option>
            <option value="Khagrachhari">Khagrachhari</option>
            <option value="Kishoreganj">Kishoreganj</option>
            <option value="Kurigram">Kurigram</option>
            <option value="Kushtia">Kushtia</option>
            <option value="Lakshmipur">Lakshmipur</option>
            <option value="Lalmonirhat">Lalmonirhat</option>
            <option value="Madaripur">Madaripur</option>
            <option value="Magura">Magura</option>
            <option value="Manikganj">Manikganj</option>
            <option value="Meherpur">Meherpur</option>
            <option value="Munshiganj">Munshiganj</option>
            <option value="Mymensingh">Mymensingh</option>
            <option value="Naogaon">Naogaon</option>
            <option value="Narail">Narail</option>
            <option value="Narsingdi">Narsingdi</option>
            <option value="Natore">Natore</option>
            <option value="Nawabganj">Nawabganj</option>
            <option value="Netrokona">Netrokona</option>
            <option value="Nilphamari">Nilphamari</option>
            <option value="Noakhali">Noakhali</option>
            <option value="Pabna">Pabna</option>
            <option value="Panchagarh">Panchagarh</option>
            <option value="Patuakhali">Patuakhali</option>
            <option value="Pirojpur">Pirojpur</option>
            <option value="Rajbari">Rajbari</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Rangamati">Rangamati</option>
            <option value="Satkhira">Satkhira</option>
            <option value="Shariatpur">Shariatpur</option>
            <option value="Sherpur">Sherpur</option>
            <option value="Sirajganj">Sirajganj</option>
            <option value="Sunamganj">Sunamganj</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Tangail">Tangail</option>
            <option value="Thakurgaon">Thakurgaon</option>
          </select>
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
          <label className="block font-semibold">Your CV link</label>
          <input
            type="url"
            required
            name="cv"
            value={formData.cv}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="CV link"
          />
        </div>

        <div>
          <label className="block font-semibold">Why wants to be a Tour Guide?</label>
          <textarea
            required
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            placeholder="Tell us about yourself"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full flex justify-center items-center gap-2"
          disabled={submitting || uploading} // disable during submission or photo upload
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>

      </form>
    </div>
  );
};

export default BeAGuide;