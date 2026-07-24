import { useEffect, useState } from "react";
import { getTrashLeads, restoreLead } from "../services/api";
import { isAdmin } from "../utils/auth";


const Trash = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmId, setConfirmId] = useState(null);


    // 🔹 Fetch trash leads
    const fetchTrash = async () => {
        try {
            const data = await getTrashLeads();
            setLeads(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    // 🔹 Restore lead
    const handleRestore = async (id) => {
        await restoreLead(id);

        // instantly update UI
        setLeads(prev => prev.filter(lead => lead.id !== id));
    };

    // 🔹 Permanent delete
    const permanentDelete = async () => {
        if (!confirmId) return;

        try {
            const res = await fetch(
                "http://localhost/api/leads/permanent_delete_lead.php",
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmId })
                }
            );

            const data = await res.json();

            if (data.success) {
                // 🔥 update UI instantly
                setLeads(prev =>
                    prev.filter(lead => lead.id !== confirmId)
                );

                // close popup
                setConfirmId(null);
            } else {
                alert("Delete failed");
            }
        } catch (err) {
            console.error("Permanent delete failed", err);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Trash</h2>
            </div>

            {leads.length === 0 ? (
                <p className="text-gray-500">Trash is empty</p>
            ) : (
                <table className="min-w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">ID</th>
                            <th className="border px-4 py-2">Campaign Id</th>
                            <th className="border px-4 py-2">Domain Name</th>
                            <th className="border px-4 py-2">First Name</th>
                            <th className="border px-4 py-2">Last Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id}>
                                <td className="border px-4 py-2">{lead.id}</td>
                                <td className="border px-4 py-2">{lead.campaign_id}</td>
                                <td className="border px-4 py-2">{lead.domain_name}</td>
                                <td className="border px-4 py-2">{lead.first_name}</td>
                                <td className="border px-4 py-2">{lead.last_name}</td>
                                <td className="border px-4 py-2">{lead.email}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleRestore(lead.id)}
                                        className="text-blue-600 hover:underline mr-4"
                                    >
                                        Restore
                                    </button>


                                    {isAdmin() && (
                                        <button style={{ backgroundColor: "#97144d" }}
                                            onClick={() => setConfirmId(lead.id)}
                                            className="text-white px-3 py-1 rounded"
                                        >
                                            Permanent Delete
                                        </button>
                                    )}


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {confirmId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-3">
                            Confirm Permanent Delete
                        </h3>

                        <p className="text-gray-600 mb-5">
                            This lead will be permanently deleted and cannot be recovered.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={permanentDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Trash;
