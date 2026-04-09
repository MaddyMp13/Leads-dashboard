import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLeads } from "../services/api";
import { deleteLead } from "../services/api";
import { restoreLead } from "../services/api";
import { isAdmin } from "../utils/auth";



const Leads = () => {
    const location = useLocation();
    const selectedPOC = new URLSearchParams(location.search).get("poc");

    const [leads, setLeads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deletedLead, setDeletedLead] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const [editLead, setEditLead] = useState(null);
    const ADMIN = isAdmin();
    const leadsPerPage = 10;

    const queryParams = new URLSearchParams(location.search);


    // 🔹 Fetch leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const data = await getLeads();
                setLeads(data);
            } catch (error) {
                console.error("Failed to fetch leads", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);


    // 🔹 Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const filteredLeads = leads
        .filter((lead) => {
            if (
                selectedPOC &&
                lead.poc_name?.trim().toLowerCase() !==
                selectedPOC.trim().toLowerCase()
            ) {
                return false;
            }

            return true;
        })
        .filter((lead) => {
            const query = search.toLowerCase();

            return (
                (lead.campaign_id || "").toLowerCase().includes(query) ||
                (lead.poc_name || "").toLowerCase().includes(query) ||
                (lead.domain_name || "").toLowerCase().includes(query) ||
                (lead.first_name || "").toLowerCase().includes(query) ||
                (lead.last_name || "").toLowerCase().includes(query) ||
                (lead.email || "").toLowerCase().includes(query) ||
                (lead.country || "").toLowerCase().includes(query)
            );
        })
        .sort((a, b) => Number(b.id) - Number(a.id));


    // 🔹 Search filter
    // const filteredLeads = leads.filter((lead) =>
    //     lead.campaign_id.toLowerCase().includes(search.toLowerCase()) ||
    //     lead.poc_name.toLowerCase().includes(search.toLowerCase()) ||
    //     lead.domain_name.toLowerCase().includes(search.toLowerCase()) ||
    //     lead.first_name.toLowerCase().includes(search.toLowerCase()) ||
    //     lead.last_name.toLowerCase().includes(search.toLowerCase()) ||
    //     lead.email.toLowerCase().includes(search.toLowerCase()) ||
    //     lead.country.toLowerCase().includes(search.toLowerCase())

    // );

    // 🔹 Pagination calculations
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(
        indexOfFirstLead,
        indexOfLastLead
    );

    // 🔹 Smart pagination numbers
    const getPagination = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push("...");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push("...");

            pages.push(totalPages);
        }

        return pages;
    };

    // 🔹 Delete handler
    const handleDelete = async (lead) => {
        await deleteLead(lead.id);

        setDeletedLead(lead);
        setShowUndo(true);

        setLeads((prev) => prev.filter((l) => l.id !== lead.id));

        setTimeout(() => {
            setShowUndo(false);
            setDeletedLead(null);
        }, 5000);
    };

    // handle undo
    const handleUndo = async () => {
        if (!deletedLead) return;

        try {
            await restoreLead(deletedLead.id);

            // re-fetch leads from DB
            const data = await getLeads();
            setLeads(data);
        } catch (err) {
            console.error("Restore failed", err);
        } finally {
            setShowUndo(false);
            setDeletedLead(null);
        }
    };

    //Save edited lead
    const handleSaveEdit = async () => {
        // Check for empty fields
        // for (let key in editLead) {
        //     if (editLead[key] === null || editLead[key] === "") {
        //         alert(`${key.replace("_ ", " ")} cannot be empty`);
        //         return;
        //     }
        // }

        try {
            const res = await fetch("http://leadsdashboard.arkentechpublishing.com/api/leads/update_lead.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editLead),
            });

            const data = await res.json();

            if (data.success) {
                setLeads((prev) =>
                    prev.map((l) =>
                        l.id === editLead.id ? editLead : l
                    )
                );
                setEditLead(null);
            } else {
                alert("Update failed");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };


    // 🔹 Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-500">
                Loading leads...
            </div>
        );
    }

    // 🔹 Empty state
    if (filteredLeads.length === 0) {
        return (
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Leads</h2>

                <input type="text" placeholder="Search by name or email..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded w-64 mb-6"
                />

                <div className="text-center text-gray-500">
                    No leads found
                </div>
            </div>
        );
    }

    return (


        <div className="bg-white p-6 rounded shadow ">
            <h2 className="text-xl font-semibold mb-4">Leads</h2>

            {/* 🔍 Search */}
            <div className="mb-4 ">
                <input autoFocus className="border px-3 py-2 rounded" style={{ width: "60%" }}
                    type="text" placeholder="Search by Campaign ID, POC Name, Domain Name, First Name, Last Name or Email ..." value={search}
                    onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* 📋 Table */}
            <div className="overflow-x-auto" >
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">SR NO</th>
                            {/* <th className="px-4 py-2 border text-left">ID</th> */}
                            <th className="px-4 py-2 border text-left">Campaign ID</th>
                            <th className="px-4 py-2 border text-left">POC Name</th>
                            <th className="px-4 py-2 border text-left">Domain Name</th>
                            <th className="px-4 py-2 border text-left">POC Link</th>
                            <th className="px-4 py-2 border text-left">Asset Link</th>
                            <th className="px-4 py-2 border text-left">First Name</th>
                            <th className="px-4 py-2 border text-left">Last Name</th>
                            <th className="px-4 py-2 border text-left">Email</th>
                            <th className="px-4 py-2 border text-left">Phone</th>
                            <th className="px-4 py-2 border text-left">Job Title</th>
                            <th className="px-4 py-2 border text-left">Job Function</th>
                            <th className="px-4 py-2 border text-left">Job Level</th>
                            <th className="px-4 py-2 border text-left">Company Name</th>
                            <th className="px-4 py-2 border text-left">Company Type</th>
                            <th className="px-4 py-2 border text-left">Company Size</th>
                            <th className="px-4 py-2 border text-left">Company Revenue</th>
                            <th className="px-4 py-2 border text-left">State</th>
                            <th className="px-4 py-2 border text-left">Country</th>
                            <th className="px-4 py-2 border text-left">User Time Zone</th>
                            <th className="px-4 py-2 border text-left">Created At</th>
                            <th className="px-4 py-2 border text-left">Opt-In 1</th>
                            <th className="px-4 py-2 border text-left">Opt-In 2</th>
                            <th className="px-4 py-2 border text-left">Question 1</th>
                            <th className="px-4 py-2 border text-left">Question 2</th>
                            <th className="px-4 py-2 border text-left">Question 3</th>
                            <th className="px-4 py-2 border text-left">Question 4</th>
                            <th className="px-4 py-2 border text-left">Question 5</th>
                            <th className="px-4 py-2 border text-left">Question 6</th>
                            <th className="px-4 py-2 border text-left">Question 7</th>
                            <th className="px-4 py-2 border text-left">Question 8</th>
                            <th className="px-4 py-2 border text-left">Question 9</th>
                            <th className="px-4 py-2 border text-left">Question 10</th>
                            <th className="px-4 py-2 border text-left">Multi Select 1</th>
                            <th className="px-4 py-2 border text-left">Multi Select 2</th>
                            <th className="px-4 py-2 border text-left">Multi Select 3</th>
                            <th className="px-4 py-2 border text-left">Multi Select 4</th>
                            <th className="px-4 py-2 border text-left">Multi Select 5</th>
                            {ADMIN && (
                                <th className="border px-4 py-2">Action</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {currentLeads.map((lead, index) => (
                            <tr key={lead.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">
                                    {(currentPage - 1) * leadsPerPage + index + 1}
                                </td>
                                {/* <td className="px-4 py-2 border">{lead.id}</td> */}
                                <td className="px-4 py-2 border">{lead.campaign_id}</td>
                                <td className="px-4 py-2 border">{lead.poc_name}</td>
                                <td className="px-4 py-2 border">{lead.domain_name}</td>
                                <td className="px-4 py-2 border">{lead.poc_link}</td>
                                <td className="px-4 py-2 border">{lead.asset_link}</td>
                                <td className="px-4 py-2 border">{lead.first_name}</td>
                                <td className="px-4 py-2 border">{lead.last_name}</td>
                                <td className="px-4 py-2 border">{lead.email}</td>
                                <td className="px-4 py-2 border">{lead.phone}</td>
                                <td className="px-4 py-2 border">{lead.job_title}</td>
                                <td className="px-4 py-2 border">{lead.job_function}</td>
                                <td className="px-4 py-2 border">{lead.job_level}</td>
                                <td className="px-4 py-2 border">{lead.company_name}</td>
                                <td className="px-4 py-2 border">{lead.company_type}</td>
                                <td className="px-4 py-2 border">{lead.company_size}</td>
                                <td className="px-4 py-2 border">{lead.company_revenue}</td>
                                <td className="px-4 py-2 border">{lead.state}</td>
                                <td className="px-4 py-2 border">{lead.country}</td>
                                {
                                    new Date(lead.user_timezone).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })
                                }
                                <td className="px-4 py-2 border">{
                                    new Date(lead.created_at).toLocaleString('en-IN', {
                                        timeZone: "Asia/Kolkata",
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })
                                }</td>
                                <td className="px-4 py-2 border">{lead.optin_1}</td>
                                <td className="px-4 py-2 border">{lead.optin_2}</td>
                                <td className="px-4 py-2 border">{lead.question_1}</td>
                                <td className="px-4 py-2 border">{lead.question_2}</td>
                                <td className="px-4 py-2 border">{lead.question_3}</td>
                                <td className="px-4 py-2 border">{lead.question_4}</td>
                                <td className="px-4 py-2 border">{lead.question_5}</td>
                                <td className="px-4 py-2 border">{lead.question_6}</td>
                                <td className="px-4 py-2 border">{lead.question_7}</td>
                                <td className="px-4 py-2 border">{lead.question_8}</td>
                                <td className="px-4 py-2 border">{lead.question_9}</td>
                                <td className="px-4 py-2 border">{lead.question_10}</td>
                                <td className="px-4 py-2 border">{lead.mul_select_1}</td>
                                <td className="px-4 py-2 border">{lead.mul_select_2}</td>
                                <td className="px-4 py-2 border">{lead.mul_select_3}</td>
                                <td className="px-4 py-2 border">{lead.mul_select_4}</td>
                                <td className="px-4 py-2 border">{lead.mul_select_5}</td>
                                {ADMIN && (
                                    <td className="px-4 border py-8 flex items-center gap-3">
                                        <button
                                            onClick={() => setEditLead(lead)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(lead)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🔢 Pagination */}
            <div className="flex justify-center mt-6 gap-2 items-center">
                <button
                    className="px-3 py-1 border rounded disabled:opacity-40"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    Prev
                </button>

                {getPagination().map((page, idx) =>
                    page === "..." ? (
                        <span key={idx} className="px-2">
                            ...
                        </span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded ${currentPage === page
                                ? "bg-black text-white"
                                : ""
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    className="px-3 py-1 border rounded disabled:opacity-40"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >Next
                </button>
            </div>



            {/* 🔁 Undo Toast */}
            {showUndo && (
                <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow flex gap-4 items-center">
                    <span>Lead deleted</span>
                    <button onClick={handleUndo} className="underline font-semibold" >
                        Undo
                    </button>
                </div>
            )}


            {editLead && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow w-96">
                        <h3 className="text-lg font-semibold mb-4">Edit Lead</h3>

                        <input autoFocus
                            type="text"
                            value={editLead.campaign_id}
                            onChange={(e) =>
                                setEditLead({ ...editLead, campaign_id: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="Campaign Id"
                        />

                        <input
                            type="text"
                            value={editLead.poc_name}
                            onChange={(e) =>
                                setEditLead({ ...editLead, poc_name: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="POC Name"
                        />

                        <input
                            type="text"
                            value={editLead.domain_name}
                            onChange={(e) =>
                                setEditLead({ ...editLead, domain_name: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="Domain Name"
                        />

                        <input
                            type="text"
                            value={editLead.poc_link}
                            onChange={(e) =>
                                setEditLead({ ...editLead, poc_link: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="POC Link"
                        />

                        <input
                            type="text"
                            value={editLead.asset_link}
                            onChange={(e) =>
                                setEditLead({ ...editLead, asset_link: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="Asset Link"
                        />

                        <input
                            type="text"
                            value={editLead.first_name}
                            onChange={(e) =>
                                setEditLead({ ...editLead, first_name: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="First Name"
                        />

                        <input
                            type="text"
                            value={editLead.last_name}
                            onChange={(e) =>
                                setEditLead({ ...editLead, last_name: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="Last Name"
                        />

                        <input
                            type="email"
                            value={editLead.email}
                            onChange={(e) =>
                                setEditLead({ ...editLead, email: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-3"
                            placeholder="Email"
                        />

                        <input
                            type="text"
                            value={editLead.phone}
                            onChange={(e) =>
                                setEditLead({ ...editLead, phone: e.target.value })
                            }
                            className="border px-3 py-2 rounded w-full mb-4"
                            placeholder="Phone"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setEditLead(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-black text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">

                {ADMIN && (
                    <button
                        onClick={() =>
                            window.open(
                                "https://leadsdashboard.arkentechpublishing.com/api/leads/export_leads.php",
                                "_blank"
                            )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Download Excel
                    </button>
                )}
            </div>

        </div>
    );
};


export default Leads;


