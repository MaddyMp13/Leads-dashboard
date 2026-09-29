const API_BASE = "https://mandar.xo.je/api";

const parseJsonResponse = async (response, fallbackMessage) => {
    const text = await response.text();
    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(text || fallbackMessage);
    }

    if (!response.ok) {
        throw new Error(data.message || fallbackMessage);
    }

    return data;
};

const postJson = async (path, payload, fallbackMessage) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response, fallbackMessage);
};

/* Login */
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    return parseJsonResponse(response, "Login failed");
};


/* 🔹 Get all leads */
export const getLeads = async () => {
    const response = await fetch(`${API_BASE}/leads/list.php`);

    if (!response.ok) {
        throw new Error("Failed to fetch leads");
    }

    return response.json();
};


/* 🔹 Update lead */
export const updateLead = async (lead) => {
    const response = await fetch(`${API_BASE}/leads/update_lead.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
    });

    return parseJsonResponse(response, "Failed to update lead");
};


/* 🔹 Delete lead */
export const deleteLead = async (id) => {
    return postJson("/leads/delete_lead.php", { id }, "Failed to delete lead");
};


// To restore lead from Trash
export const restoreLead = async (id) => {
    return postJson("/leads/restore.php", { id }, "Failed to restore lead");
};

// Get Trash leads
export const getTrashLeads = async () => {
    const response = await fetch(`${API_BASE}/leads/trash.php`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch trash leads");
    }

    return response.json();
};


// Permanent delete lead
export const permanentDeleteLead = async (id) => {
    return postJson(
        "/leads/permanent_delete_lead.php",
        { id },
        "Failed to permanently delete lead"
    );
};

const runBulkOperation = async (ids, operation) => {
    const settled = await Promise.allSettled(ids.map((id) => operation(id)));

    return {
        succeeded: ids.filter((_, index) => settled[index].status === "fulfilled"),
        failed: settled
            .map((result, index) => ({ result, id: ids[index] }))
            .filter(({ result }) => result.status === "rejected")
            .map(({ result, id }) => ({
                id,
                message: result.reason?.message || "Operation failed",
            })),
    };
};

export const bulkRestoreLeads = async (ids) => runBulkOperation(ids, restoreLead);

export const bulkPermanentDeleteLeads = async (ids) => runBulkOperation(ids, permanentDeleteLead);

const API_user = `${API_BASE}/users`;
/* 🔹 Get All Users */
export const getUsers = async () => {
    const response = await fetch(`${API_user}/users.php`);

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return response.json();
};

// /* 🔹 Create User */
// export const createUser = async (userData) => {
//     const response = await fetch(`${API_user}/create_user.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData)
//     });

//     return response.json();
// };

// /* 🔹 Delete User */
// export const deleteUser = async (id) => {
//     const response = await fetch(`${API_user}/delete_user.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id })
//     });

//     return response.json();
// };

// /* 🔹 Update Password */
// export const updatePassword = async (id, password) => {
//     const response = await fetch(`${API_user}/update_password.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, password })
//     });

//     return response.json();
// };
