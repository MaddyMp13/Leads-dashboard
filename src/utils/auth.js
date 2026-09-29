export const getUser = () =>
    JSON.parse(localStorage.getItem("user"));

export const isAdmin = () => {
    const user = getUser();
    return user?.role === "admin";
};

export const logout = () => {
    localStorage.removeItem("user");
};
