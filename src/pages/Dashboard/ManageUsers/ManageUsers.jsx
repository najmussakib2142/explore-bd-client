import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import useAxios from "../../../hooks/useAxios";
import Loading from "../../shared/Loading/Loading";

const ManageUsers = () => {
    const axiosInstance = useAxios();
    const [currentPage, setCurrentPage] = useState(0); // ✅ page starts at 0
    const [itemsPerPage, setItemsPerPage] = useState(10); // ✅ default
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");

    const { data, isLoading, error } = useQuery({
        queryKey: ["users", currentPage, itemsPerPage, search, role],
        queryFn: async () => {
            const res = await axiosInstance.get(
                `/users?page=${currentPage + 1}&limit=${itemsPerPage}&search=${search}&role=${role}`
            );
            return res.data;
        },
    });

    const totalPages = data?.totalPages || 0;
    const pages = [...Array(totalPages).keys()];

    // 🔄 Pagination Handlers
    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    };

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0); // reset to first page
    };

    const roles = [
        { value: "all", label: "All" },
        { value: "user", label: "User / Tourist" },
        { value: "guide", label: "Guide" },
        { value: "admin", label: "Admin" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

            {/* 🔍 Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="input input-bordered w-full md:w-1/2"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(0);
                    }}
                />

                <Select
                    options={roles}
                    value={roles.find((r) => r.value === role)}
                    onChange={(opt) => {
                        setRole(opt.value);
                        setCurrentPage(0);
                    }}
                    className="w-full md:w-1/3"
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            borderColor: "#ccc",
                            boxShadow: "none",
                            "&:hover": {
                                borderColor: "#2563eb", // Tailwind's blue-600
                            },
                        }),
                        option: (base, state) => ({
                            ...base,
                            color: state.isSelected ? "white" : "#1f2937", // selected white, default gray-800
                            backgroundColor: state.isSelected
                                ? "#2563eb" // Tailwind blue-600
                                : state.isFocused
                                    ? "#e0f2fe" // Tailwind blue-100
                                    : "white",
                            "&:hover": {
                                backgroundColor: "#e0f2fe",
                                color: "#1f2937",
                            },
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: "#111827", // text-gray-900
                        }),
                    }}
                />
            </div>


            {/* 🌀 Loading/Error */}
            {isLoading && <Loading></Loading>}
            {error && <p className="text-red-500 text-center py-10">Failed to load users</p>}

            {/* 📊 Table */}
            {!isLoading && data?.users?.length > 0 && (
                <>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Created At</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((user, idx) => (
                                    <tr key={user._id}>
                                        {/* <td>{idx + 1}</td> */}
                                        <td>{currentPage * itemsPerPage + idx + 1}</td>
                                        <td>{user.email}</td>
                                        <td>{user.displayName}</td>
                                        <td>{user.created_at}</td>
                                        <td>
                                            <span
                                                className={`badge ${user.role === "admin"
                                                    ? "badge-error"   // red for admin
                                                    : user.role === "guide"
                                                        ? "badge-warning" // yellow for guide
                                                        : "badge-info"    // blue for normal user
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 🔄 Pagination */}
                    <div className="pagination mt-6 flex justify-center items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded ${currentPage === page
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    }`}
                            >
                                {page + 1}
                            </button>
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === pages.length - 1}
                            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            Next
                        </button>

                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPage}
                            className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </>
            )}

            {/* No Users */}
            {!isLoading && data?.users?.length === 0 && (
                <p className="text-center text-gray-500">No users found.</p>
            )}
        </div>
    );
};

export default ManageUsers;
