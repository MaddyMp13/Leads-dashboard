import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
<<<<<<< HEAD
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="min-w-0 flex-1">
                <Header />
                <main className="p-4 sm:p-6">
=======
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <div className="flex-1 w-96 min-h-screen bg-gray-100">
                <Header />
                <main className="p-6">
>>>>>>> f1cd4945016d214eed5758c39cbb2ed6158d43fc
                    <Outlet />
                </main>
            </div>
        </div>
    );
}


export default DashboardLayout;
