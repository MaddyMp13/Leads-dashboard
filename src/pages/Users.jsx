import { useEffect, useState } from "react";

import { getUsers } from "../services/api";

function Users() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        <div style={{ padding: "20px" }}>
            <h2>User Management</h2>


            {/* Users Table */}
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>{Array.isArray(users) && users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                    </tr>
                ))}</tbody>
            </table>
        </div >
    );
}


export default Users;
