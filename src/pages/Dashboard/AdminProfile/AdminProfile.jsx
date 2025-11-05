import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../shared/Loading/Loading";
import { FaMoneyBillWave, FaUserTie, FaBoxOpen, FaUsers, FaBook } from "react-icons/fa";

const COLORS = [
  "#4B5CF0", // Indigo 500 - Base professional tone
  "#4352DB", // Indigo 550 - Slightly darker
  "#3B48C7", // Indigo 600 - Deep gradient transition
  "#333EB3", // Indigo 650 - Strong, still readable
  "#2B349F", // Indigo 700 - Bold for emphasis sections
];

const AdminProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    const [editMode, setEditMode] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        photo: "",
        phone: "",
        age: "",
        bio: "",
        email: user?.email || "",
        role: user?.role || "User",
    });

    // Fetch overall stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stats");
            return res.data;
        },
    });

    // Define statItems after stats is loaded
    const statItems = stats
        ? [
            { label: "Total Payment", value: stats.totalPayment, icon: <FaMoneyBillWave /> },
            { label: "Total Guides", value: stats.totalGuides, icon: <FaUserTie /> },
            { label: "Total Packages", value: stats.totalPackages, icon: <FaBoxOpen /> },
            { label: "Total Clients", value: stats.totalClients, icon: <FaUsers /> },
            { label: "Total Stories", value: stats.totalStories, icon: <FaBook /> },
        ]
        : [];

    const [animatedStats, setAnimatedStats] = useState(statItems.map(() => 0));

    // Animate stats when stats data is available
    useEffect(() => {
        if (!stats) return;

        const timers = statItems.map((stat, idx) => {
            let start = 0;
            const end = stat.value;
            const duration = 2000;
            const increment = end / (duration / 50);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    start = end;
                    clearInterval(timer);
                }

                setAnimatedStats(prev => {
                    const newArr = [...prev];
                    newArr[idx] = Math.floor(start);
                    return newArr;
                });
            }, 50);

            return timer;
        });

        // Cleanup timers on unmount
        return () => timers.forEach(timer => clearInterval(timer));
    }, [stats]);

    // Fetch admin info
    const { data: adminInfo, isLoading: adminLoading } = useQuery({
        queryKey: ["adminInfo", user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        onSuccess: data => {
            setFormData({
                name: data.name || "",
                photo: data.photo || "",
                phone: data.phone || "",
                age: data.age || "",
                bio: data.bio || "",
                email: data.email || "",
                role: data.role || "admin",
            });
        },
    });

    // Fetch package stats
    const { data: packageStats = [], isLoading: packageLoading } = useQuery({
        queryKey: ["packageStats"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stats/packages");
            return res.data;
        },
    });

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-base-100 dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
                    <p className="text-sm text-indigo-600 dark:text-pink-400">
                        Revenue: ৳{(data?.totalRevenue ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Bookings: {data.bookingsCount}
                    </p>
                </div>
            );
        }
        return null;
    };

    const handleEditClick = () => {
        setFormData({
            name: adminInfo.name || "",
            photo: adminInfo.photo || "",
            phone: adminInfo.phone || "",
            age: adminInfo.age || "",
            bio: adminInfo.bio || "",
            email: adminInfo.email || "",
            role: adminInfo.role || "admin",
        });
        setPhotoFile(null);
        setEditMode(true);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = e => setPhotoFile(e.target.files[0]);

    const handleUpdate = async () => {
        try {
            let uploadedPhotoUrl = formData.photo;

            if (photoFile) {
                const imgData = new FormData();
                imgData.append("image", photoFile);
                const res = await fetch(imageUploadUrl, { method: "POST", body: imgData });
                const data = await res.json();
                if (data.success) uploadedPhotoUrl = data.data.display_url;
            }

            if (updateUserProfile) {
                await updateUserProfile({
                    displayName: formData.name || adminInfo.name,
                    photoURL: uploadedPhotoUrl,
                });
            }

            const updatedFields = {};
            ["name", "phone", "age", "bio"].forEach(field => {
                if (formData[field] !== adminInfo[field]) updatedFields[field] = formData[field];
            });
            if (photoFile) updatedFields.photo = uploadedPhotoUrl;

            if (Object.keys(updatedFields).length > 0) {
                await axiosInstance.patch(`/users/${user.email}`, updatedFields);
                Swal.fire("Success!", "Profile updated successfully", "success");
                queryClient.invalidateQueries(["adminInfo", user.email]);
            } else {
                Swal.fire("Info", "No changes to update", "info");
            }

            setEditMode(false);
        } catch (error) {
            console.error(error);
            Swal.fire("Error!", "Failed to update profile", "error");
        }
    };

    if (statsLoading || adminLoading || packageLoading) return <Loading />;

    return (
        <div className="md:p-6 p-2 max-w-7xl mx-auto">
            {/* Welcome */}
            <motion.h1
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Welcome, {adminInfo.name || user.displayName}!
            </motion.h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statItems.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white dark:bg-gray-800/20 p-4 rounded-2xl shadow-lg text-center hover:shadow-xl hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="flex justify-center mb-2 text-indigo-600 dark:text-pink-400 text-3xl">
                            {stat.icon}
                        </div>
                        <p className="text-gray-500 dark:text-gray-300 font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold text-indigo-700 dark:text-pink-300 mt-1">
                            {animatedStats[idx].toLocaleString()}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Popular/Earning Packages */}
            <div className="bg-white dark:bg-gray-800/20 rounded-xl shadow-lg p-4 mb-8 w-full overflow-x-auto" data-aos="fade-up">
                <h2 className="text-xl font-semibold mb-4">Top Packages (by Revenue)</h2>
                <div className="min-w-[500px] sm:min-w-[600px] md:min-w-full">
                    <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 300 : 500}>
                        <BarChart data={packageStats} layout="vertical" margin={{ top: 20, right: 40, bottom: 20, left: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, "dataMax"]} tickFormatter={(v) => `৳${(v ?? 0).toLocaleString()}`} />
                            <YAxis dataKey="name" type="category" width={150} tickFormatter={v => (v.length > 20 ? v.substring(0, 20) + "…" : v)} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="totalRevenue" radius={[0, 8, 8, 0]}>
                                {packageStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Admin Info Card */}
            <motion.div
                className="bg-white dark:bg-gray-800/20 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-3xl font-bold text-white overflow-hidden">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.photoURL} className="w-full h-full object-cover" />
                    ) : (
                        <span>{user.displayName?.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div className="flex-1 ">
                    <p className="text-xl text-primary font-semibold">{adminInfo.name || user.displayName}</p>
                    <p className="text-gray-500 dark:text-gray-300 capitalize">{adminInfo.role}</p>
                    <p className="text-gray-500 dark:text-gray-300">{adminInfo.email}</p>
                    <p className="text-gray-500 dark:text-gray-300">{adminInfo.phone || "No phone"}</p>
                    <button
                        onClick={handleEditClick}
                        className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 dark:bg-pink-500 text-white hover:bg-indigo-700 dark:hover:bg-pink-600 transition"
                    >
                        Edit Profile
                    </button>
                </div>
            </motion.div>

            {/* Edit Modal */}
            {editMode && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                        <div className="flex flex-col gap-3">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered w-full" />
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="file-input file-input-bordered w-full" />
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="input input-bordered w-full" />
                            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="input input-bordered w-full" />
                            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="textarea textarea-bordered w-full" />
                            <input type="email" value={adminInfo.email} readOnly className="input input-bordered w-full bg-base-100 cursor-not-allowed" />
                            <input type="text" value={adminInfo.role} readOnly className="input input-bordered w-full bg-base-100 cursor-not-allowed" />
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                            <button onClick={() => setEditMode(false)} className="btn btn-outline">Cancel</button>
                            <button onClick={handleUpdate} className="btn btn-primary">Save</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
