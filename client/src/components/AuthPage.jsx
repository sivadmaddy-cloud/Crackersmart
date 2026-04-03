

import { useState } from "react";
import AdminLogin from "../pages/AdminLogin";
import CustomerLogin from "../pages/CustomerLogin";
import CustomerSignup from "../pages/CustomerSignup";
import bgImage from "../assets/bg10.jpg";

const AuthPage = () => {
  const [role, setRole] = useState("");
  const [page, setPage] = useState("");

  const resetToHome = () => {
    setRole("");
    setPage("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})`, fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-input::placeholder { color: rgba(255,255,255,0.28); }
        .auth-input:focus {
          border-color: rgba(255,255,255,0.28) !important;
          background: rgba(255,255,255,0.1) !important;
        }
      `}</style>

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,8,20,0.82), rgba(25,15,45,0.78))" }} />

      {/* Glass card */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 rounded-3xl p-10"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Brand */}
        <div className="text-center mb-8 cursor-pointer" onClick={resetToHome}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 300, color: "#fff", letterSpacing: "0.08em", margin: 0 }}>
            Authenticate
          </h1>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "6px" }}>
            Secure access portal
          </p>
        </div>

        {/* STEP 1: Role selection */}
        {!role && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Select role</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "admin",    icon: "⚙", label: "Admin" },
                { id: "customer", icon: "◎", label: "Customer" },
              ].map(({ id, icon, label }) => (
                <button
                  key={id}
                  onClick={() => { setRole(id); if (id === "customer") setPage("login"); }}
                  className="flex flex-col items-center gap-2 py-5 rounded-2xl transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                >
                  <span style={{ fontSize: "20px", width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 2: Admin */}
        {role === "admin" && (
          <>
            <button onClick={resetToHome} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer", padding: 0, marginBottom: "16px", fontFamily: "'DM Sans', sans-serif" }}>
              ← back
            </button>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center", marginBottom: "20px" }}>
              Admin access
            </p>
            <AdminLogin />
          </>
        )}

        {/* STEP 2: Customer */}
        {role === "customer" && (
          <>
            <button onClick={resetToHome} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer", padding: 0, marginBottom: "16px", fontFamily: "'DM Sans', sans-serif" }}>
              ← back
            </button>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
              {[{ id: "login", label: "Sign in" }, { id: "signup", label: "Create account" }].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPage(id)}
                  className="flex-1 py-2 rounded-lg text-sm transition-all duration-200"
                  style={{
                    background: page === id ? "rgba(255,255,255,0.13)" : "transparent",
                    color: page === id ? "#fff" : "rgba(255,255,255,0.38)",
                    border: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {page === "login"  && <CustomerLogin />}
            {page === "signup" && <CustomerSignup />}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;