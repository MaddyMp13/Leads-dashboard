import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import { getLeads } from "../services/api";

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

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(collapsed));
    }, [collapsed]);

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

        if (domain) {
            params.set("domain", domain);
        } else {
            params.delete("domain");
        }

        params.delete("poc");

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    };

    const getFilteredPath = (pathname) => {
        if (!selectedDomain || pathname === "/trash" || pathname === "/users") return pathname;

        const params = new URLSearchParams();
        params.set("domain", selectedDomain);

        return `${pathname}?${params.toString()}`;
    };

    return (
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
};

export default Sidebar;
