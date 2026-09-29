import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import { getLeads } from "../services/api";

<<<<<<< HEAD
const STORAGE_KEY = "arken-sidebar-collapsed";

const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "D" },
    { label: "Leads", path: "/leads", icon: "L" },
    { label: "Trash", path: "/trash", icon: "T", adminOnly: true },
    { label: "Users", path: "/users", icon: "U", adminOnly: true },
];

const Sidebar = () => {
    const [leads, setLeads] = useState([]);
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === "true");
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDomain = new URLSearchParams(location.search).get("domain") || "";
=======

const Sidebar = () => {
    const [leads, setLeads] = useState([]);
<<<<<<< HEAD
    const [selectedDomain, setSelectedDomain] = useState(
        localStorage.getItem("selectedDomain") || ""
    );
    const location = useLocation();
    const navigate = useNavigate();
=======
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDomain = new URLSearchParams(location.search).get("domain") || "";
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const data = await getLeads();
                setLeads(data || []);
            } catch (error) {
                console.error("Failed to fetch domains", error);
            }
        };

        fetchDomains();
    }, []);

<<<<<<< HEAD
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(collapsed));
    }, [collapsed]);

=======
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
    const domainOptions = useMemo(() => {
        const counts = leads.reduce((acc, lead) => {
            const domain = lead.domain_name?.trim();
            if (!domain) return acc;

            acc[domain] = (acc[domain] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
    }, [leads]);

    const handleDomainChange = (event) => {
        const params = new URLSearchParams(location.search);
        const domain = event.target.value;

<<<<<<< HEAD
        if (domain) {
            params.set("domain", domain);
        } else {
=======
<<<<<<< HEAD
        setSelectedDomain(domain);
        window.dispatchEvent(
            new CustomEvent("selected-domain-change", { detail: domain })
        );

        if (domain) {
            localStorage.setItem("selectedDomain", domain);
            params.set("domain", domain);
        } else {
            localStorage.removeItem("selectedDomain");
=======
        if (domain) {
            params.set("domain", domain);
        } else {
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
            params.delete("domain");
        }

        params.delete("poc");

<<<<<<< HEAD
        navigate({
            pathname: location.pathname,
            search: params.toString(),
=======
<<<<<<< HEAD
        if (location.pathname === "/dashboard") {
            navigate({ pathname: location.pathname, search: "" });
            return;
        }

=======
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
        navigate({
            pathname: location.pathname,
            search: params.toString()
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
        });
    };

    const getFilteredPath = (pathname) => {
<<<<<<< HEAD
        if (!selectedDomain || pathname === "/trash" || pathname === "/users") return pathname;
=======
<<<<<<< HEAD
        if (pathname === "/dashboard") return pathname;
=======
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4
        if (!selectedDomain) return pathname;
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc

        const params = new URLSearchParams();
        params.set("domain", selectedDomain);

        return `${pathname}?${params.toString()}`;
    };

    return (
<<<<<<< HEAD
        <aside
            className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-gray-800 bg-gray-950 text-white shadow-xl transition-all duration-300 ${collapsed ? "w-20" : "w-72"}`}
        >
            <div className="flex h-20 items-center justify-between gap-3 border-b border-white/10 px-4">
                {!collapsed && (
                    <div className="min-w-0">
                        <img
                            src="https://arkentechpublishing.com/wp-content/uploads/2023/05/Header-logo.png.webp"
                            alt="Arken Logo"
                            className="h-9 w-auto"
                        />
                        <p className="mt-1 truncate text-xs font-medium text-gray-400">Control Panel</p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setCollapsed((value) => !value)}
                    className="ml-auto flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-lg font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? ">" : "<"}
                </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto p-3">
                {!collapsed && (
                    <div className="mb-5 rounded-lg border border-white/10 bg-white/5 p-3">
                        <label htmlFor="domain-filter" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Filter by Domain
                        </label>
                        <select
                            id="domain-filter"
                            value={selectedDomain}
                            onChange={handleDomainChange}
                            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                        >
                            <option value="">All Domains</option>
                            {domainOptions.map(([domain, count]) => (
                                <option key={domain} value={domain}>
                                    {domain} ({count})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {navItems
                    .filter((item) => !item.adminOnly || isAdmin())
                    .map((item) => (
                        <NavLink
                            key={item.path}
                            to={getFilteredPath(item.path)}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition ${isActive
                                    ? "bg-pink-700 text-white shadow"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                                } ${collapsed ? "justify-center" : ""}`
                            }
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-bold">
                                {item.icon}
                            </span>
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
            </nav>
        </aside>
    );
=======
        <aside className="bg-gray-900 text-white p-4 ">

<<<<<<< HEAD
            <img src="https://arkentechsolutions.com/wp-content/uploads/2026/02/Arken-Logo.webp" alt='Arken-Logo' width={"150px"} className="mb-5 " />
=======
            <img src="https://arkentechpublishing.com/wp-content/uploads/2023/05/Header-logo.png.webp" alt='Arken-Logo' width={"150px"} />
>>>>>>> 8d86ed56903a6a1374c2d2ad6b7dd0969f4574b4

            <h2 className="text-xl font-bold mb-6">Control Panel</h2>

            <nav className="space-y-2">

                <div className="mt-8">
                    <label htmlFor="domain-filter" className="block text-sm font-semibold mb-2">
                        Filter by Domain
                    </label>
                    <select
                        id="domain-filter"
                        value={selectedDomain}
                        onChange={handleDomainChange}
                        className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Domains</option>
                        {domainOptions.map(([domain, count]) => (
                            <option key={domain} value={domain}>
                                {domain} ({count})
                            </option>
                        ))}
                    </select>
                </div>

                <NavLink
                    to={getFilteredPath("/dashboard")}
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to={getFilteredPath("/leads")}
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                        }`
                    }
                >
                    Leads
                </NavLink>

                {isAdmin() && (
                    <NavLink to="/trash"
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                            }`
                        }>
                        Trash
                    </NavLink>
                )}

                {/* < Link to="/trash" className="block py-2 px-4 hover:bg-gray-100">
                    Trash
                </> */}


                {isAdmin() && (
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        Users
                    </NavLink>
                )}
            </nav>


        </aside >
    );

>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
};

export default Sidebar;
