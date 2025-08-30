import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import useAxios from "../../../hooks/useAxios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

const AdminProfile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const axiosInstance = useAxios()
    const queryClient = useQueryClient();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: "", photo: "", phone: "" });

    const renderYAxisTick = (props) => {
        const { x, y, payload } = props;
        const value = String(payload.value || ""); // ensure it's a string
        const words = value.split(" ");
        return (
            <g transform={`translate(${x},${y})`}>
                {words.map((word, i) => (
                    <text
                        key={i}
                        x={0}
                        y={i * 14}
                        textAnchor="end"
                        fill="#888"
                        fontSize={12}
                    >
                        {word}
                    </text>
                ))}
            </g>
        );
    };


    // Fetch overall stats
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stats");
            return res.data;
        },
    });

    // Fetch admin info
    const { data: adminInfo, isLoading: adminLoading } = useQuery({
        queryKey: ["adminInfo", user.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        onSuccess: (data) => {
            setFormData({
                name: data.name || "",
                photo: data.photo || "",
                phone: data.phone || "",
            });
        },
    });

    // Fetch package stats (dynamic)
    const { data: packageStats = [], isLoading: packageLoading } = useQuery({
        queryKey: ["packageStats"],
        queryFn: async () => {
            const res = await axiosInstance.get("/stats/packages");
            return res.data;
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axiosInstance.patch(`/users/${user.email}`, formData);
            setEditMode(false);
            Swal.fire("Success!", "Profile updated successfully", "success");
            queryClient.invalidateQueries(["adminInfo", user.email]);
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to update profile", "error");
        }
    };

    if (statsLoading || adminLoading || packageLoading)
        return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
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
                {[
                    { label: "Total Payment", value: `$${stats.totalPayment}` },
                    { label: "Total Guides", value: stats.totalGuides },
                    { label: "Total Packages", value: stats.totalPackages },
                    { label: "Total Clients", value: stats.totalClients },
                    { label: "Total Stories", value: stats.totalStories },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <p className="text-gray-500 dark:text-gray-300">{stat.label}</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-pink-400">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Popular/Earning Packages */}
            <div className="bg-base-100 dark:bg-base-100 rounded-xl shadow-lg p-4 mb-8">
                <h2 className="text-xl font-semibold mb-4">Top Packages (by Revenue)</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={packageStats} layout="vertical" margin={{ top: 20, right: 20, bottom: 20, left: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, "dataMax"]} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <YAxis dataKey="name" type="category" tick={renderYAxisTick} width={150} />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Bar dataKey="totalRevenue" fill="#0088FE">
                            {packageStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Admin Info Card */}
            <motion.div
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-3xl font-bold text-white overflow-hidden">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt={user.photoURL} className="w-full h-full object-cover" />
                    ) : (
                        <span>{user.displayName?.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-xl font-semibold">{user.displayName}</p>
                    <p className="text-gray-500 dark:text-gray-300 capitalize">{adminInfo.role}</p>
                    <p className="text-gray-500 dark:text-gray-300">{adminInfo.email}</p>
                    <p className="text-gray-500 dark:text-gray-300">{adminInfo.phone || "No phone"}</p>
                    <button
                        onClick={() => setEditMode(true)}
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
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                name="photo"
                                placeholder="Photo URL"
                                value={formData.photo}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-3">
                            <button onClick={() => setEditMode(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button onClick={handleUpdate} className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
