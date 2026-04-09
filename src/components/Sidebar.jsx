import { NavLink } from "react-router-dom";
import { isAdmin } from "../utils/auth";


const Sidebar = () => {
    return (
        <aside className="bg-gray-900 text-white p-4 ">

            <img src="http://leadsdashboard.arkentechpublishing.com/Arken-logo" alt='Arken-Logo' width={"150px"} />

            <h2 className="text-xl font-bold mb-6">Control Panel</h2>

            <nav className="space-y-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `block px-4 py-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/leads"
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
