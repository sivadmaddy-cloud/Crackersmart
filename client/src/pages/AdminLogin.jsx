import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/admin/login", {
        email:    email.trim(),
        password: password.trim(),
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role",  "admin");
        localStorage.setItem("user",  JSON.stringify(res.data.admin));
        alert("Admin Login Successful");
        navigate("/admin-dashboard");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  };

  return (
    // ✅ NO bg-white wrapper — AuthPage provides the card
    <form onSubmit={handleSubmit} className="space-y-3">

      {error && (
        <p className="text-xs text-center py-2 px-3 rounded-lg"
           style={{ color: "#ff6b6b", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)" }}>
          {error}
        </p>
      )}

      <input
        type="email"
        placeholder="Admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
        style={{
          background: "rgba(255,255,255,0.9)",
          color: "#0a0814",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Signing in..." : "Sign in as Admin"}
      </button>

    </form>
  );
};

export default AdminLogin;