import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteLead, getLeads, restoreLead, updateLead } from "../services/api";
import { isAdmin } from "../utils/auth";
import { EXPORT_COLUMNS } from "../utils/leadFields";
import DateTimeDisplay from "../components/DateTimeDisplay";
import LeadEditModal from "../components/LeadEditModal";
import Toast from "../components/Toast";

const leadsPerPage = 10;
const displayColumns = EXPORT_COLUMNS.filter(([key]) => key !== "created_at");

const Leads = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedPOC = queryParams.get("poc");
    const selectedDomain = queryParams.get("domain");

    const [leads, setLeads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deletedLead, setDeletedLead] = useState(null);
    const [editLead, setEditLead] = useState(null);
    const [toast, setToast] = useState(null);
    const admin = isAdmin();

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const data = await getLeads();
            setLeads(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch leads", error);
            setToast({ type: "error", message: error.message || "Failed to fetch leads." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedPOC, selectedDomain]);

    const filteredLeads = useMemo(() => {
        const query = search.trim().toLowerCase();

        return leads
            .filter((lead) => {
                if (
                    selectedPOC &&
                    lead.poc_name?.trim().toLowerCase() !== selectedPOC.trim().toLowerCase()
                ) {
                    return false;
                }

                if (
                    selectedDomain &&
                    lead.domain_name?.trim().toLowerCase() !== selectedDomain.trim().toLowerCase()
                ) {
                    return false;
                }

                return true;
            })
            .filter((lead) => {
                if (!query) return true;

                return [
                    lead.campaign_id,
                    lead.poc_name,
                    lead.domain_name,
                    lead.first_name,
                    lead.last_name,
                    lead.email,
                    lead.country,
                ].some((value) => String(value || "").toLowerCase().includes(query));
            })
            .sort((a, b) => Number(b.id) - Number(a.id));
    }, [leads, search, selectedDomain, selectedPOC]);

    const totalPages = Math.max(1, Math.ceil(filteredLeads.length / leadsPerPage));
    const currentLeads = filteredLeads.slice(
        (currentPage - 1) * leadsPerPage,
        currentPage * leadsPerPage
    );

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

    const formatExportValue = (value) => {
        if (value === null || value === undefined) return "";
        return String(value).replace(/"/g, '""');
    };

    const getExportFileName = () => {
        const parts = ["leads"];
        if (selectedDomain) parts.push(selectedDomain);
        if (selectedPOC) parts.push(selectedPOC);
        if (search.trim()) parts.push(search.trim());

        const safeName = parts
            .join("-")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        return `${safeName || "leads"}.csv`;
    };

    const handleDownloadExcel = () => {
        if (filteredLeads.length === 0) {
            setToast({ type: "error", message: "No filtered leads available to download." });
            return;
        }

        const headerRow = EXPORT_COLUMNS.map(([, label]) => `"${label}"`).join(",");
        const dataRows = filteredLeads.map((lead) =>
            EXPORT_COLUMNS.map(([key]) => `"${formatExportValue(lead[key])}"`).join(",")
        );
        const csvContent = [headerRow, ...dataRows].join("\r\n");
        const blob = new Blob([`\uFEFF${csvContent}`], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = getExportFileName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDelete = async (lead) => {
        try {
            await deleteLead(lead.id);
            setDeletedLead(lead);
            setLeads((prev) => prev.filter((item) => item.id !== lead.id));
            setToast({ type: "success", message: "Lead deleted.", actionLabel: "Undo" });

            window.setTimeout(() => {
                setDeletedLead(null);
                setToast((current) => current?.actionLabel === "Undo" ? null : current);
            }, 5000);
        } catch (err) {
            setToast({ type: "error", message: err.message || "Delete failed." });
        }
    };

    const handleUndo = async () => {
        if (!deletedLead) return;

        try {
            await restoreLead(deletedLead.id);
            await fetchLeads();
            setToast({ type: "success", message: "Lead restored." });
        } catch (err) {
            setToast({ type: "error", message: err.message || "Restore failed." });
        } finally {
            setDeletedLead(null);
        }
    };

    const handleSaveEdit = async (lead) => {
        if (!lead?.id) {
            throw new Error("Lead id is missing. Please refresh and try again.");
        }

        const data = await updateLead(lead);

        if (!data.success) {
            throw new Error(data.message || "Update failed.");
        }

        setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, ...lead } : item)));
        setEditLead(null);
        setToast({ type: "success", message: "Lead updated successfully." });
    };

    const emptyTitle = selectedDomain ? `Leads - ${selectedDomain}` : "Leads";

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-950">{emptyTitle}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading ? "Loading leads..." : `${filteredLeads.length} matching leads`}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        autoFocus
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100 sm:w-96"
                        type="text"
                        placeholder="Search campaign, POC, domain, name, email or country"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    {admin && (
                        <button
                            type="button"
                            onClick={handleDownloadExcel}
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                        >
                            Download Excel
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    Loading leads...
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    No leads found
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="border-b px-4 py-3">SR No</th>
                                    {displayColumns.map(([key, label]) => (
                                        <th key={key} className="whitespace-nowrap border-b px-4 py-3">
                                            {label}
                                        </th>
                                    ))}
                                    <th className="whitespace-nowrap border-b px-4 py-3">Lead Local Time</th>
                                    <th className="whitespace-nowrap border-b px-4 py-3">India Time</th>
                                    {admin && <th className="border-b px-4 py-3">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentLeads.map((lead, index) => (
                                    <tr key={lead.id} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                                            {(currentPage - 1) * leadsPerPage + index + 1}
                                        </td>
                                        {displayColumns.map(([key]) => (
                                            <td key={key} className="max-w-72 whitespace-nowrap px-4 py-3 text-gray-700">
                                                <span title={String(lead[key] || "")} className="block truncate">
                                                    {lead[key] || "-"}
                                                </span>
                                            </td>
                                        ))}
                                        <td className="px-4 py-3">
                                            <DateTimeDisplay lead={lead} mode="local" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <DateTimeDisplay lead={lead} mode="india" />
                                        </td>
                                        {admin && (
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditLead({ ...lead })}
                                                    className="mr-3 font-semibold text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(lead)}
                                                    className="font-semibold text-red-600 hover:text-red-800"
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

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-40"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                            >
                                Prev
                            </button>

                            {getPagination().map((page, idx) =>
                                page === "..." ? (
                                    <span key={`${page}-${idx}`} className="px-2 py-2 text-sm text-gray-500">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`rounded-md border px-3 py-2 text-sm font-medium ${currentPage === page
                                            ? "border-gray-950 bg-gray-950 text-white"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-40"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {editLead && (
                <LeadEditModal
                    lead={editLead}
                    leads={leads}
                    onCancel={() => setEditLead(null)}
                    onSave={handleSaveEdit}
                />
            )}

            <Toast
                {...toast}
                onAction={toast?.actionLabel === "Undo" ? handleUndo : undefined}
                onClose={() => setToast(null)}
            />
        </div>
    );
};

export default Leads;
