import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";
import { getLeads } from "../services/api";


const Sidebar = () => {
    const [leads, setLeads] = useState([]);
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
            search: params.toString()
        });
    };

    const getFilteredPath = (pathname) => {
        if (!selectedDomain) return pathname;

        const params = new URLSearchParams();
        params.set("domain", selectedDomain);

        return `${pathname}?${params.toString()}`;
    };

    return (
        <aside className="bg-gray-900 text-white p-4 ">

            <img src="https://arkentechpublishing.com/wp-content/uploads/2023/05/Header-logo.png.webp" alt='Arken-Logo' width={"150px"} />

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

};

export default Sidebar;
