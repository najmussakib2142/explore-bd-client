import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield, FaUserTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [emailQuery, setEmailQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        data = {},
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["searchedUsers", emailQuery, currentPage, itemsPerPage],
        enabled: !!emailQuery,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/search`, {
                params: { email: emailQuery, page: currentPage, limit: itemsPerPage }
            });
            return res.data;
        },
    });

    const users = data.users || [];
    const count = data.count || 0;
    const numberOfPages = Math.ceil(count / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];

    const { mutateAsync: updateRole } = useMutation({
        mutationFn: async ({ id, role }) =>
            await axiosSecure.patch(`/users/${id}/role`, { role }),
        onSuccess: () => {
            refetch();
        },
    });

    const handleRoleChange = async (id, currentRole) => {
        const action = currentRole === "admin" ? "Remove admin" : "Make admin";
        const newRole = currentRole === "admin" ? "user" : "admin";

        const confirm = await Swal.fire({
            title: `${action}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmButtonColor: currentRole === "admin" ? "#dc2626" : "#16a34a",
            cancelButtonColor: "#6b7280",
        });

        if (!confirm.isConfirmed) return;

        try {
            Swal.fire({
                title: "Updating...",
                text: "Please wait while the role is being updated.",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            await updateRole({ id, role: newRole });
            Swal.fire("Success", `${action} successful`, "success");
        } catch  {
            // console.log(error);
            Swal.fire("Error", "Failed to update user role", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Make Admin</h2>

            <div className="flex gap-2 mb-6 items-center">
                <FaSearch />
                <input
                    type="text"
                    className="input input-bordered w-full max-w-md"
                    placeholder="Search user by email"
                    value={emailQuery}
                    onChange={(e) => {
                        setEmailQuery(e.target.value);
                        setCurrentPage(0); // reset page on new search
                    }}
                />
            </div>

            {isFetching && <p className="text-blue-500">🔄 Searching users...</p>}

            {!isFetching && users.length === 0 && emailQuery && (
                <p className="text-gray-500">No users found.</p>
            )}

            {users.length > 0 && (
                <>
                    <div className="overflow-x-auto">
                        <table className="table w-full ">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Created At</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td>{u.email}</td>
                                        <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span
                                                className={`badge 
                                                    ${u.role === "admin" ? "badge-success" :
                                                        u.role === "guide" ? "badge-info" :
                                                            "badge-ghost"}`}
                                            >
                                                {u.role || "user"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleRoleChange(u._id, u.role || "user")}
                                                className={`btn btn-sm text-black ${u.role === "admin" ? "btn-error" : "btn-primary"}`}
                                            >
                                                {u.role === "admin" ? (
                                                    <>
                                                        <FaUserTimes className="mr-1" />
                                                        Remove Admin
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserShield className="mr-1" />
                                                        Make Admin
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination controls */}
                    <div className="pagination mt-6 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
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
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))}
                            disabled={currentPage === pages.length - 1}
                            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            Next
                        </button>

                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(parseInt(e.target.value));
                                setCurrentPage(0);
                            }}
                            className="ml-3 border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </>
            )}
        </div>
    );
};

export default MakeAdmin;
