import { useEffect, useMemo, useRef, useState } from "react";
import {
    bulkPermanentDeleteLeads,
    bulkRestoreLeads,
    getTrashLeads,
    permanentDeleteLead,
    restoreLead,
} from "../services/api";
import { isAdmin } from "../utils/auth";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";

const leadsPerPage = 10;

const Trash = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [confirmAction, setConfirmAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const selectAllRef = useRef(null);
    const admin = isAdmin();

    const totalPages = Math.max(1, Math.ceil(leads.length / leadsPerPage));
    const currentLeads = useMemo(() => {
        const start = (currentPage - 1) * leadsPerPage;
        return leads.slice(start, start + leadsPerPage);
    }, [currentPage, leads]);
    const currentIds = currentLeads.map((lead) => lead.id);
    const selectedCount = selectedIds.size;
    const selectedOnPage = currentIds.filter((id) => selectedIds.has(id)).length;
    const allCurrentSelected = currentIds.length > 0 && selectedOnPage === currentIds.length;
    const someCurrentSelected = selectedOnPage > 0 && selectedOnPage < currentIds.length;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someCurrentSelected;
        }
    }, [someCurrentSelected]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const data = await getTrashLeads();
            setLeads(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setToast({ type: "error", message: err.message || "Failed to fetch trash leads." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const toggleSelected = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleCurrentPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (allCurrentSelected) {
                currentIds.forEach((id) => next.delete(id));
            } else {
                currentIds.forEach((id) => next.add(id));
            }

            return next;
        });
    };

    const removeIds = (ids) => {
        const idSet = new Set(ids);
        setLeads((prev) => prev.filter((lead) => !idSet.has(lead.id)));
        setSelectedIds((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => next.delete(id));
            return next;
        });
    };

    const handleRestore = async (id) => {
        try {
            await restoreLead(id);
            removeIds([id]);
            setToast({ type: "success", message: "Lead restored successfully." });
        } catch (err) {
            setToast({ type: "error", message: err.message || "Restore failed." });
        }
    };

    const handlePermanentDelete = async (id) => {
        setActionLoading(true);
        try {
            await permanentDeleteLead(id);
            removeIds([id]);
            setConfirmAction(null);
            setToast({ type: "success", message: "Lead permanently deleted." });
        } catch (err) {
            setToast({ type: "error", message: err.message || "Permanent delete failed." });
        } finally {
            setActionLoading(false);
        }
    };

    const runBulkRestore = async () => {
        const ids = [...selectedIds];
        setActionLoading(true);
        try {
            const result = await bulkRestoreLeads(ids);
            removeIds(result.succeeded);
            setConfirmAction(null);
            setToast({
                type: result.failed.length ? "error" : "success",
                message: result.failed.length
                    ? `${result.succeeded.length} restored, ${result.failed.length} failed.`
                    : `${result.succeeded.length} leads restored successfully.`,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const runBulkPermanentDelete = async () => {
        const ids = [...selectedIds];
        setActionLoading(true);
        try {
            const result = await bulkPermanentDeleteLeads(ids);
            removeIds(result.succeeded);
            setConfirmAction(null);
            setToast({
                type: result.failed.length ? "error" : "success",
                message: result.failed.length
                    ? `${result.succeeded.length} deleted, ${result.failed.length} failed.`
                    : `${result.succeeded.length} leads permanently deleted.`,
            });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-950">Trash</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading ? "Loading deleted leads..." : `${leads.length} deleted leads`}
                    </p>
                </div>
            </div>

            {selectedCount > 0 && (
                <div className="mb-4 flex flex-col gap-3 rounded-lg border border-pink-100 bg-pink-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-semibold text-pink-900">
                        {selectedCount} {selectedCount === 1 ? "lead" : "leads"} selected
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setConfirmAction({ type: "bulk-restore" })}
                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Restore Selected
                        </button>
                        {admin && (
                            <button
                                type="button"
                                onClick={() => setConfirmAction({ type: "bulk-delete" })}
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Delete Permanently
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setSelectedIds(new Set())}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white"
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    Loading trash...
                </div>
            ) : leads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    Trash is empty
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th className="w-12 border-b px-4 py-3">
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            checked={allCurrentSelected}
                                            onChange={toggleCurrentPage}
                                            aria-label="Select all leads on this page"
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="border-b px-4 py-3">ID</th>
                                    <th className="border-b px-4 py-3">Campaign ID</th>
                                    <th className="border-b px-4 py-3">Domain Name</th>
                                    <th className="border-b px-4 py-3">First Name</th>
                                    <th className="border-b px-4 py-3">Last Name</th>
                                    <th className="border-b px-4 py-3">Email</th>
                                    <th className="border-b px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentLeads.map((lead) => (
                                    <tr key={lead.id} className={selectedIds.has(lead.id) ? "bg-pink-50/60" : "hover:bg-gray-50"}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(lead.id)}
                                                onChange={() => toggleSelected(lead.id)}
                                                aria-label={`Select lead ${lead.id}`}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{lead.id}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{lead.campaign_id}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{lead.domain_name}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{lead.first_name}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{lead.last_name}</td>
                                        <td className="whitespace-nowrap px-4 py-3">{lead.email}</td>
                                        <td className="whitespace-nowrap px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => handleRestore(lead.id)}
                                                className="mr-3 font-semibold text-blue-600 hover:text-blue-800"
                                            >
                                                Restore
                                            </button>
                                            {admin && (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmAction({ type: "single-delete", id: lead.id })}
                                                    className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                                                >
                                                    Permanent Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                        <p className="text-sm text-gray-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
                                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            {confirmAction?.type === "single-delete" && (
                <ConfirmationModal
                    title="Confirm Permanent Delete"
                    message="This lead will be permanently deleted and cannot be recovered."
                    confirmLabel="Delete Permanently"
                    loading={actionLoading}
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={() => handlePermanentDelete(confirmAction.id)}
                />
            )}

            {confirmAction?.type === "bulk-restore" && (
                <ConfirmationModal
                    title="Restore Selected Leads"
                    message={`Restore ${selectedCount} selected ${selectedCount === 1 ? "lead" : "leads"} back to the active leads table?`}
                    confirmLabel="Restore Selected"
                    tone="primary"
                    loading={actionLoading}
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={runBulkRestore}
                />
            )}

            {confirmAction?.type === "bulk-delete" && (
                <ConfirmationModal
                    title="Delete Permanently"
                    message={`Are you sure you want to permanently delete ${selectedCount} selected ${selectedCount === 1 ? "lead" : "leads"}? This action cannot be undone.`}
                    confirmLabel="Delete Permanently"
                    loading={actionLoading}
                    onCancel={() => setConfirmAction(null)}
                    onConfirm={runBulkPermanentDelete}
                />
            )}

            <Toast {...toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default Trash;
