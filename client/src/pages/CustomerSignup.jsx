import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerSignup() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();

  const signup = async () => {
    if (name.trim() === "")     return alert("Name is required");
    if (email.trim() === "")    return alert("Email is required");
    if (password.trim() === "") return alert("Password is required");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/signup", {
        name:     name.trim(),
        email:    email.trim(),
        password: password.trim(),
        role:     "customer",
      });

      if (res.data.success === false) {
        return alert(res.data.message || "Signup failed");
      }

      alert("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Try again.");
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
    <div className="space-y-3">

      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
      />

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Create password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
        style={inputStyle}
      />

      <button
        onClick={signup}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
        style={{
          background: "rgba(255,255,255,0.9)",
          color: "#0a0814",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
        By continuing, you agree to{" "}
        <span className="underline cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>Terms of Use</span>{" "}
        and{" "}
        <span className="underline cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>Privacy Policy</span>.
      </p>
    </div>
  );
}

export default CustomerSignup;