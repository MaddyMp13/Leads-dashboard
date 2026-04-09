import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://leadsdashboard.arkentechpublishing.com/api/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            // 🔐 SAVE USER
            localStorage.setItem("user", JSON.stringify(data.user));

            // 🚀 GO TO DASHBOARD
            navigate("/dashboard");

        } catch (err) {
            setError("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ backgroundImage: "url('http://leadsdashboard.arkentechpublishing.com/Arken-Wallpaper.png')", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover" }}>
            <form
                onSubmit={handleLogin}
                className=" p-6 rounded shadow w-64"
            >
                <h2 className="text-2xl text-white font-semibold mb-4 text-center">
                    Dashboard Login
                </h2>

                {error && (
                    <p className="text-red-600 text-sm mb-3">{error}</p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    className="border rounded p-2 w-full mb-3"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border rounded p-2 w-full mb-4"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button className="bg-red-600 text-white w-full py-2 rounded">
                    Login
                </button>
            </form>
        </div >
    );
};

export default Login;
