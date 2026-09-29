const TIMEZONE_ALIASES = {
    EST: "America/New_York",
    EDT: "America/New_York",
    CST: "America/Chicago",
    CDT: "America/Chicago",
    MST: "America/Denver",
    MDT: "America/Denver",
    PST: "America/Los_Angeles",
    PDT: "America/Los_Angeles",
    IST: "Asia/Kolkata",
};

const COUNTRY_TIMEZONES = {
    "united states": "America/New_York",
    usa: "America/New_York",
    us: "America/New_York",
    canada: "America/Toronto",
    india: "Asia/Kolkata",
    "united kingdom": "Europe/London",
    uk: "Europe/London",
    australia: "Australia/Sydney",
    germany: "Europe/Berlin",
    france: "Europe/Paris",
    singapore: "Asia/Singapore",
    japan: "Asia/Tokyo",
    "united arab emirates": "Asia/Dubai",
    uae: "Asia/Dubai",
};

const isValidTimeZone = (timeZone) => {
    if (!timeZone) return false;

    try {
        new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
        return true;
    } catch {
        return false;
    }
};

export const resolveLeadTimeZone = (lead = {}) => {
    const rawTimeZone = [
        lead.user_timezone,
        lead.timezone,
        lead.time_zone,
        lead.tz,
    ].find(Boolean);

    if (rawTimeZone) {
        const normalized = String(rawTimeZone).trim();
        const alias = TIMEZONE_ALIASES[normalized.toUpperCase()];

        if (alias) return alias;
        if (isValidTimeZone(normalized)) return normalized;
    }

    const country = String(lead.country || "").trim().toLowerCase();
    return COUNTRY_TIMEZONES[country] || "UTC";
};

export const parseLeadTimestamp = (value) => {
    if (!value) return null;

    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

    const raw = String(value).trim();
    if (!raw) return null;

    const hasTimeZone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(raw);
    const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
    const date = new Date(hasTimeZone ? normalized : `${normalized}Z`);

    return Number.isNaN(date.getTime()) ? null : date;
};

export const formatLeadDateTime = (value, timeZone) => {
    const date = parseLeadTimestamp(value);
    if (!date) return "Not available";

    const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone,
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
    }).format(date);

    return timeZone === "Asia/Kolkata" ? formatted.replace("GMT+5:30", "IST") : formatted;
};
