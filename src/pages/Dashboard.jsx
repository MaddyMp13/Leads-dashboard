import React, { useEffect, useState } from "react";
import { getLeads, getUsers } from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const selectedDomain = new URLSearchParams(location.search).get("domain") || "";
    const itemsPerPage = 5;

    // ✅ Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadsData, usersData] = await Promise.all([
                    getLeads(),
                    getUsers()
                ]);

                setLeads(leadsData || []);
                setUsers(usersData || []);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ✅ Dashboard Stats
    const domainFilteredLeads = selectedDomain
        ? leads.filter(
            (lead) =>
                lead.domain_name?.trim().toLowerCase() === selectedDomain.trim().toLowerCase()
        )
        : leads;

    const totalLeads = domainFilteredLeads.length;
    // const totalUsers = new Set(users.map(u => u.email)).size;
    const uniqueDomains = new Set(
        domainFilteredLeads.map(l => l.domain_name?.trim()).filter(Boolean)
    ).size;

    // ✅ Unique POC Names
    const uniquePOCNames = [...new Set(domainFilteredLeads.map(l => l.poc_name?.trim()).filter(Boolean))];
    const totalPOC = uniquePOCNames.length;

    // ✅ Search Filter (Case insensitive)
    const filteredPOCNames = uniquePOCNames.filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Pagination Based on Filtered Results
    const totalPages = Math.ceil(filteredPOCNames.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPOCNames = filteredPOCNames.slice(indexOfFirst, indexOfLast);

    // ✅ Smart Pagination UI
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

    // ✅ Reset page when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedDomain]);

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

            {/* 📊 Stats Cards */}
            <div className="flex gap-6 mb-8">
                <div className="w-1/3 bg-pink-800 text-white p-6 rounded shadow-lg">
                    <h4>Total Leads</h4>
                    <p className="text-xl">{totalLeads}</p>
                </div>

                <div className="w-1/3 bg-pink-800 text-white p-6 rounded shadow-lg">
                    <h4>Total POC Count</h4>
                    <p className="text-xl">{totalPOC}</p>
                </div>

                <div className="w-1/3 bg-pink-800 text-white p-6 rounded shadow-lg">
                    <h4>Domains</h4>
                    <p className="text-xl">{uniqueDomains}</p>
                </div>
            </div>

            {/* 📋 POC Table */}
            <h3 className="text-xl font-semibold mb-4">
                {selectedDomain ? `POC Names for ${selectedDomain}` : "All POC Names"}
            </h3>

            {/* 🔎 Search Box */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search POC name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-700"
                />
            </div>


            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border text-left">POC Name</th>
                    </tr>
                </thead>

                <tbody>
                    {currentPOCNames.length > 0 ? (
                        currentPOCNames.map((name, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">
                                    <p
                                        onClick={() => {
                                            const params = new URLSearchParams();
                                            params.set("poc", name);

                                            if (selectedDomain) {
                                                params.set("domain", selectedDomain);
                                            }

                                            navigate(`/leads?${params.toString()}`);
                                        }}
                                        className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                                    >
                                        {name}
                                    </p>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="px-4 py-4 text-center text-gray-500">
                                No POC found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 🔢 Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2 items-center">
                    <button
                        className="px-3 py-1 border rounded disabled:opacity-40"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
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
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

