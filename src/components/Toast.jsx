const Toast = ({ message, type = "success", actionLabel, onAction, onClose }) => {
    if (!message) return null;

    const classes = type === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-emerald-200 bg-emerald-50 text-emerald-800";

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex max-w-md items-center gap-4 rounded-lg border px-4 py-3 text-sm shadow-xl ${classes}`}>
            <span>{message}</span>
            {actionLabel && (
                <button type="button" onClick={onAction} className="font-semibold underline">
                    {actionLabel}
                </button>
            )}
            {onClose && (
                <button type="button" onClick={onClose} className="font-semibold">
                    Close
                </button>
            )}
        </div>
    );
};

export default Toast;
