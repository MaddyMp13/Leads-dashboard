<<<<<<< HEAD
const API_BASE = "https://mandar.xo.je/api";
=======
<<<<<<< HEAD
// const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE = "https://mandar.xo.je/api";
=======
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE = isLocalHost
    ? "http://localhost/api"
    : "https://leadsdashboard.arkentechpublishing.com/api";
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc

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

<<<<<<< HEAD
const postJson = async (path, payload, fallbackMessage) => {
    const response = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return parseJsonResponse(response, fallbackMessage);
};

=======
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
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
<<<<<<< HEAD
    return postJson("/leads/delete_lead.php", { id }, "Failed to delete lead");
=======
    const res = await fetch(`${API_BASE}/leads/delete_lead.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    return res.json();
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
};


// To restore lead from Trash
export const restoreLead = async (id) => {
<<<<<<< HEAD
    return postJson("/leads/restore.php", { id }, "Failed to restore lead");
=======
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
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
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


<<<<<<< HEAD
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

=======
<<<<<<< HEAD
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


=======
// Permenant delete lead
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
const permanentDelete = async () => {
    if (!confirmId) return;

    try {
<<<<<<< HEAD
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
=======
        const res = await fetch(`${API_BASE}/leads/permanent_delete_lead.php`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: confirmId })
            }
        );
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4

        const data = await res.json();

        if (data.success) {
<<<<<<< HEAD
            setLeads(prev => prev.filter(lead => lead.id !== confirmId));
            setConfirmId(null);
        } else {
            console.error(data.message);
        }

    } catch (err) {
        console.error("Permanent delete failed:", err);
    }
};





=======
            setLeads(prev =>
                prev.filter(lead => lead.id !== confirmId)
            );
            setConfirmId(null);
        }
    } catch (err) {
        console.error("Permanent delete failed", err);
    }
};

>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
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
