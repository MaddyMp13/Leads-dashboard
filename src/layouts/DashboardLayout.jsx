import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <div className="flex-1 w-96 min-h-screen bg-gray-100">
                <Header />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


export default DashboardLayout;
