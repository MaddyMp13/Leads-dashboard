import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Header() {
    const navigate = useNavigate(); // ✅ initialize

    const handleLogout = () => {
        logout();              // clear session
        navigate("/login");    // ✅ go to route, not file
    };

    return (
        <header className="h-14 bg-white border-b flex items-center justify-between px-6 py-4">
            <h1 className="font-semibold text-gray-700">
                Welcome to Arkentech Dashboard 👋
            </h1>

            <button style={{ backgroundColor: "#97144d" }}
                onClick={handleLogout}
                className=" text-white hover:bg-red-700 px-4 py-1 rounded"
            >
                Logout
            </button>

        </header>
    );
}

export default Header;
