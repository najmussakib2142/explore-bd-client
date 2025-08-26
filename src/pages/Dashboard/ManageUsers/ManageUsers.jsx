import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import useAxios from "../../../hooks/useAxios";

const ManageUsers = () => {
    const axiosInstance = useAxios();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // React Query
    const { data, isLoading, error } = useQuery({
        queryKey: ["users", page, search, role, itemsPerPage],
        queryFn: async () => {
            const res = await axiosInstance.get(
                `/users?page=${page}&limit=${itemsPerPage}&search=${search}&role=${role}`
            );
            return res.data;
        },
        keepPreviousData: true,
    });

    const roles = [
        { value: "all", label: "All" },
        { value: "user", label: "User / Tourist" },
        { value: "guide", label: "Guide" },
        { value: "admin", label: "Admin" },
    ];

    const handleItemsPerPage = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setPage(1); // reset to first page
    };

    const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setPage((prev) => Math.min(prev + 1, data.totalPages));

    const pages = data ? Array.from({ length: data.totalPages }, (_, i) => i + 1) : [];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="input input-bordered w-full md:w-1/2"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <Select
                    options={roles}
                    value={roles.find((r) => r.value === role)}
                    onChange={(opt) => {
                        setRole(opt.value);
                        setPage(1);
                    }}
                    className="w-full md:w-1/3"
                />
            </div>

            {/* Loading/Error */}
            {isLoading && <p>Loading users...</p>}
            {error && <p className="text-red-500">Failed to load users</p>}

            {/* Table */}
            {!isLoading && data?.users?.length > 0 && (
                <>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((user, idx) => (
                                    <tr key={user._id}>
                                        <td>{(page - 1) * itemsPerPage + idx + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="badge badge-info">{user.role}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination mt-6 flex justify-center items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {pages.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-3 py-1 rounded ${page === p
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={page === data.totalPages}
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
