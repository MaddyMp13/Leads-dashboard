// const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
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
    const res = await fetch(`${API_BASE}/leads/delete_lead.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    return res.json();
};


// To restore lead from Trash
export const restoreLead = async (id) => {
    const response = await fetch(`${API_BASE}/leads/restore.php`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to restore lead");
    }

    return response.json();
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


// // Permenant delete lead
// const permanentDelete = async () => {
//     if (!confirmId) return;

//     try {
//         const res = await fetch(`${API_BASE}/leads/permanent_delete_lead.php`,
//             {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ id: confirmId })
//             }
//         );

//         const data = await res.json();

//         if (data.success) {
//             setLeads(prev =>
//                 prev.filter(lead => lead.id !== confirmId)
//             );
//             setConfirmId(null);
//         }
//     } catch (err) {
//         console.error("Permanent delete failed", err);
//     }
// };


const permanentDelete = async () => {
    if (!confirmId) return;

    try {
        const res = await fetch(`${API_BASE}/leads/permanent_delete_lead.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: confirmId
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
            setLeads(prev => prev.filter(lead => lead.id !== confirmId));
            setConfirmId(null);
        } else {
            console.error(data.message);
        }

    } catch (err) {
        console.error("Permanent delete failed:", err);
    }
};





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
