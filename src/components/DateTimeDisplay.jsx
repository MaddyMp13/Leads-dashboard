import { formatLeadDateTime, resolveLeadTimeZone } from "../utils/leadTime";

const DateTimeDisplay = ({ lead, mode = "local" }) => {
    const timeZone = mode === "india" ? "Asia/Kolkata" : resolveLeadTimeZone(lead);
    const label = formatLeadDateTime(lead?.created_at, timeZone);

    return (
        <span title={timeZone} className="whitespace-nowrap text-gray-800">
            {label}
        </span>
    );
};

export default DateTimeDisplay;
