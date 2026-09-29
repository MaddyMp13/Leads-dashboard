import { useEffect, useState } from "react";

import { getUsers } from "../services/api";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
        };

        fetchUsers();
    }, []);


    return (
        <div style={{ padding: "20px" }}>
            <h2>User Management</h2>


            {/* Users Table */}
            <div className="w-full">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        User Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage users, roles, and account information.
                    </p>
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Name
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Email
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Role
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                    >
                                        Created
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {Array.isArray(users) &&
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            {/* Name */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                                                        {user.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {user.email}
                                                </span>
                                            </td>

                                            {/* Role */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${user.role === "admin"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Created */}
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {Array.isArray(users) && users.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <p className="text-sm font-medium text-gray-900">
                                No users found
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                There are currently no users to display.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}


export default Users;
