export const SYSTEM_FIELDS = new Set([
    "id",
    "created_at",
    "updated_at",
    "deleted_at",
    "deleted",
    "is_deleted",
    "status",
]);

export const FIELD_LABELS = {
    campaign_id: "Campaign ID",
    poc_name: "POC Name",
    domain_name: "Domain Name",
    poc_link: "POC Link",
    asset_link: "Asset Link",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    phone: "Phone",
    job_title: "Job Title",
    job_function: "Job Function",
    job_level: "Job Level",
    company_name: "Company Name",
    company_type: "Company Type",
    industry: "Industry",
    company_size: "Company Size",
    company_revenue: "Company Revenue",
    state: "State",
    country: "Country",
    user_timezone: "User Time Zone",
    optin_1: "Opt-In 1",
    optin_2: "Opt-In 2",
};

const SECTION_FIELDS = {
    "Personal Information": ["first_name", "last_name", "email", "phone", "linkedin_url", "linkedin", "linkedIn_url"],
    "Company Information": ["company_name", "company_type", "industry", "company_size", "company_revenue", "domain_name", "country", "state", "user_timezone", "timezone", "time_zone"],
    "Professional Information": ["job_title", "job_function", "job_level", "role", "function", "level"],
    "Campaign Information": ["campaign_id", "poc_name", "poc_link", "asset_link", "optin_1", "optin_2"],
    "Custom Questions": [],
};

export const EXPORT_COLUMNS = [
    ["campaign_id", "Campaign ID"],
    ["poc_name", "POC Name"],
    ["domain_name", "Domain Name"],
    ["poc_link", "POC Link"],
    ["asset_link", "Asset Link"],
    ["first_name", "First Name"],
    ["last_name", "Last Name"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["job_title", "Job Title"],
    ["job_function", "Job Function"],
    ["job_level", "Job Level"],
    ["company_name", "Company Name"],
    ["company_type", "Company Type"],
    ["industry", "Industry"],
    ["company_size", "Company Size"],
    ["company_revenue", "Company Revenue"],
    ["state", "State"],
    ["country", "Country"],
    ["user_timezone", "User Time Zone"],
    ["created_at", "Created At"],
    ["optin_1", "Opt-In 1"],
    ["optin_2", "Opt-In 2"],
    ["question_1", "Question 1"],
    ["question_2", "Question 2"],
    ["question_3", "Question 3"],
    ["question_4", "Question 4"],
    ["question_5", "Question 5"],
    ["question_6", "Question 6"],
    ["question_7", "Question 7"],
    ["question_8", "Question 8"],
    ["question_9", "Question 9"],
    ["question_10", "Question 10"],
    ["mul_select_1", "Multi Select 1"],
    ["mul_select_2", "Multi Select 2"],
    ["mul_select_3", "Multi Select 3"],
    ["mul_select_4", "Multi Select 4"],
    ["mul_select_5", "Multi Select 5"],
];

export const getFieldLabel = (key) => {
    if (FIELD_LABELS[key]) return FIELD_LABELS[key];

    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getInputType = (key, value) => {
    const lower = key.toLowerCase();

    if (lower.includes("email")) return "email";
    if (lower.includes("phone") || lower.includes("mobile")) return "tel";
    if (lower.includes("url") || lower.includes("link")) return "url";
    if (lower.includes("date")) return "date";
    if (lower.includes("time")) return "text";
    if (typeof value === "boolean" || lower.startsWith("is_") || lower.includes("optin")) return "checkbox";

    return "text";
};

export const getEditableFields = (lead = {}) =>
    Object.keys(lead).filter((key) => !SYSTEM_FIELDS.has(key));

export const groupEditableFields = (lead = {}) => {
    const fields = getEditableFields(lead);
    const groups = Object.fromEntries(Object.keys(SECTION_FIELDS).map((section) => [section, []]));
    const used = new Set();

    Object.entries(SECTION_FIELDS).forEach(([section, sectionFields]) => {
        sectionFields.forEach((field) => {
            if (fields.includes(field)) {
                groups[section].push(field);
                used.add(field);
            }
        });
    });

    fields.forEach((field) => {
        if (used.has(field)) return;

        if (/^(question|q)_?\d+/i.test(field) || /^mul_?select/i.test(field)) {
            groups["Custom Questions"].push(field);
        } else {
            if (!groups["Additional Fields"]) groups["Additional Fields"] = [];
            groups["Additional Fields"].push(field);
        }
    });

    return Object.entries(groups).filter(([, sectionFields]) => sectionFields.length > 0);
};

export const buildOptionMap = (leads = []) => {
    const optionKeys = [
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

    return optionKeys.reduce((acc, key) => {
        const options = [...new Set(leads.map((lead) => lead?.[key]).filter(Boolean).map(String))]
            .sort((a, b) => a.localeCompare(b));

        if (options.length > 0 && options.length <= 80) acc[key] = options;
        return acc;
    }, {});
};

export const validateLead = (lead = {}) => {
    const errors = {};

    if ("email" in lead && lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
        errors.email = "Enter a valid email address.";
    }

    if ("phone" in lead && lead.phone && !/^[+()\-\s\d.]{7,25}$/.test(lead.phone)) {
        errors.phone = "Enter a valid phone number.";
    }

    ["first_name", "last_name", "email"].forEach((field) => {
        if (field in lead && String(lead[field] || "").trim() === "") {
            errors[field] = `${getFieldLabel(field)} is required.`;
        }
    });

    return errors;
};
