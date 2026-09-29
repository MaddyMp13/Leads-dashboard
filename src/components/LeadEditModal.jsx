import { useMemo, useState } from "react";
import {
    getFieldLabel,
    getInputType,
    groupEditableFields,
    validateLead,
} from "../utils/leadFields";

const LeadEditModal = ({ lead, leads = [], onCancel, onSave }) => {
    const [form, setForm] = useState(() => ({ ...lead }));
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [saving, setSaving] = useState(false);

    const groupedFields = useMemo(() => groupEditableFields(form), [form]);
    const optionMap = useMemo(() => {
        const keys = [
            "company_type",
            "company_size",
            "company_revenue",
            "industry",
            "country",
            "state",
            "job_function",
            "job_level",
            "campaign_id",
            "poc_name",
            "domain_name",
            "user_timezone",
        ];

        return keys.reduce((acc, key) => {
            const options = [...new Set(leads.map((item) => item?.[key]).filter(Boolean).map(String))]
                .sort((a, b) => a.localeCompare(b));
            if (options.length > 0 && options.length <= 80) acc[key] = options;
            return acc;
        }, {});
    }, [leads]);

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setServerError("");
    };

    const renderField = (field) => {
        const value = form[field];
        const type = getInputType(field, value);
        const label = getFieldLabel(field);
        const commonClass = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-100";

        if (type === "checkbox") {
            return (
                <label key={field} className="flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2">
                    <input
                        type="checkbox"
                        checked={["1", "true", "yes", true].includes(value)}
                        onChange={(event) => updateField(field, event.target.checked ? "1" : "0")}
                        className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
            );
        }

        if (optionMap[field]) {
            return (
                <label key={field} className="block">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <select
                        value={value || ""}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={commonClass}
                    >
                        <option value="">Select {label}</option>
                        {optionMap[field].map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    {errors[field] && <p className="mt-1 text-xs text-red-600">{errors[field]}</p>}
                </label>
            );
        }

        const isLongText = String(value || "").length > 120 || /^question/i.test(field) || /^mul_?select/i.test(field);

        return (
            <label key={field} className="block">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                {isLongText ? (
                    <textarea
                        value={value || ""}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={`${commonClass} min-h-24 resize-y`}
                    />
                ) : (
                    <input
                        type={type}
                        value={value || ""}
                        onChange={(event) => updateField(field, event.target.value)}
                        className={commonClass}
                    />
                )}
                {errors[field] && <p className="mt-1 text-xs text-red-600">{errors[field]}</p>}
            </label>
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateLead(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setSaving(true);
        setServerError("");

        try {
            await onSave(form);
        } catch (err) {
            setServerError(err.message || "Unable to save this lead.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <form onSubmit={handleSubmit} className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-lg bg-white shadow-2xl">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-950">Edit Lead</h3>
                    <p className="mt-1 text-sm text-gray-500">Update editable lead fields from the current API record.</p>
                </div>

                <div className="overflow-y-auto px-6 py-5">
                    {serverError && (
                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-8">
                        {groupedFields.map(([section, fields]) => (
                            <section key={section}>
                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{section}</h4>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {fields.map(renderField)}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeadEditModal;
