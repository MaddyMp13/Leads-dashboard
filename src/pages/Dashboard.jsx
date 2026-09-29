<<<<<<< HEAD
import { useEffect, useState } from "react";
import { getLeads } from "../services/api";
=======
import React, { useEffect, useState } from "react";
import { getLeads, getUsers } from "../services/api";
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
<<<<<<< HEAD
=======
    const [users, setUsers] = useState([]);
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
<<<<<<< HEAD
    const selectedDomain = new URLSearchParams(location.search).get("domain") || "";
    const itemsPerPage = 5;

=======
<<<<<<< HEAD
    // const selectedDomain = new URLSearchParams(location.search).get("domain") || "";
    const [selectedDomain, setSelectedDomain] = useState(
        localStorage.getItem("selectedDomain") || ""
    );
    const itemsPerPage = 5;

    useEffect(() => {
        if (!location.search) return;

        navigate("/dashboard", { replace: true });
    }, [location.search, navigate]);

    useEffect(() => {
        const handleSelectedDomainChange = (event) => {
            setSelectedDomain(event.detail || "");
        };

        window.addEventListener("selected-domain-change", handleSelectedDomainChange);

        return () => {
            window.removeEventListener("selected-domain-change", handleSelectedDomainChange);
        };
    }, []);

=======
    const selectedDomain = new URLSearchParams(location.search).get("domain") || "";
    const itemsPerPage = 5;

>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
    // ✅ Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
<<<<<<< HEAD
                const leadsData = await getLeads();
                setLeads(leadsData || []);
=======
                const [leadsData, usersData] = await Promise.all([
                    getLeads(),
                    getUsers()
                ]);

                setLeads(leadsData || []);
                setUsers(usersData || []);
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
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
<<<<<<< HEAD
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8">

            {/* ================= HEADER ================= */}
            <div className="mb-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Dashboard Overview
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Monitor your leads, POCs, and domains from one place.
                        </p>
                    </div>
                </div>
            </div>


            {/* ================= STATS CARDS ================= */}
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Total Leads */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Leads
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                {totalLeads}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                Total leads in your database
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100">
                            <svg
                                className="h-6 w-6 text-pink-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-10a4 4 0 110 8 4 4 0 010-8zm6 4a3 3 0 10-6 0 3 3 0 006 0z"
                                />
                            </svg>
                        </div>

                    </div>

                    <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-pink-50 opacity-60" />
                </div>


                {/* Total POC */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total POC Count
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                {totalPOC}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                Unique points of contact
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                            <svg
                                className="h-6 w-6 text-purple-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>

                    </div>

                    <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-purple-50 opacity-60" />
                </div>


                {/* Domains */}
                <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Domains
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                {uniqueDomains}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                Unique domains available
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                            <svg
                                className="h-6 w-6 text-blue-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3.5 7.5A2.5 2.5 0 016 5h4l2 2h6.5A2.5 2.5 0 0121 9.5v7a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16V8z"
                                />
                            </svg>
                        </div>

                    </div>

                    <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-blue-50 opacity-60" />
                </div>

            </div>


            {/* ================= POC SECTION ================= */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* Section Header */}
                <div className="border-b border-gray-200 px-6 py-5">

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedDomain
                                    ? `POC Names for ${selectedDomain}`
                                    : "All POC Names"}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Select a POC to view their associated leads.
                            </p>
                        </div>


                        {/* Search */}
                        <div className="relative w-full md:w-80">

                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>

                            <input
                                type="text"
                                placeholder="Search POC name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-100"
                            />

                        </div>

                    </div>
                </div>


                {/* ================= TABLE ================= */}
                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    POC Name
                                </th>

                                <th
                                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>


                        <tbody className="divide-y divide-gray-100">

                            {currentPOCNames.length > 0 ? (

                                currentPOCNames.map((name, index) => (

                                    <tr
                                        key={index}
                                        className="group transition-colors hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                {/* Avatar */}
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-semibold text-pink-700">
                                                    {name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <span className="text-sm font-medium text-gray-900">
                                                    {name}
                                                </span>

                                            </div>

                                        </td>


                                        <td className="px-6 py-4 text-right">

                                            <button
                                                onClick={() => {
                                                    const params =
                                                        new URLSearchParams();

                                                    params.set("poc", name);

                                                    if (selectedDomain) {
                                                        params.set(
                                                            "domain",
                                                            selectedDomain
                                                        );
                                                    }

                                                    navigate(
                                                        `/leads?${params.toString()}`
                                                    );
                                                }}
                                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-pink-700 transition hover:bg-pink-50"
                                            >
                                                View Leads

                                                <svg
                                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan="2"
                                        className="px-6 py-14 text-center"
                                    >

                                        <div className="flex flex-col items-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">

                                                <svg
                                                    className="h-6 w-6 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                                    />
                                                </svg>

                                            </div>

                                            <p className="text-sm font-semibold text-gray-900">
                                                No POC found
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Try searching with a different name.
                                            </p>

                                        </div>

                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ================= PAGINATION ================= */}
                {totalPages > 1 && (

                    <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                        <p className="text-sm text-gray-500">
                            Page{" "}
                            <span className="font-medium text-gray-900">
                                {currentPage}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-gray-900">
                                {totalPages}
                            </span>
                        </p>


                        <div className="flex items-center gap-1">

                            {/* Previous */}
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>


                            {/* Pages */}
                            <div className="flex items-center gap-1">

                                {getPagination().map((page, idx) =>
                                    page === "..." ? (

                                        <span
                                            key={idx}
                                            className="px-2 text-sm text-gray-400"
                                        >
                                            ...
                                        </span>

                                    ) : (

                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentPage(page)
                                            }
                                            className={`min-w-[38px] rounded-lg px-3 py-2 text-sm font-medium transition ${currentPage === page
                                                ? "bg-pink-700 text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>

                                    )
                                )}

                            </div>


                            {/* Next */}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>

                        </div>

                    </div>

                )}

            </div>

=======
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
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
        </div>
    );
};

export default Dashboard;
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======

>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
