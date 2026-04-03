import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerLogin() {
  const [mode,     setMode]     = useState("email");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [phone,    setPhone]    = useState("");
  const [otp,      setOtp]      = useState("");
  const [otpSent,  setOtpSent]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const navigate = useNavigate();

  const loginWithPassword = async () => {
    if (!email || !password) return alert("Enter email & password");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      if (!res.data.success) return alert(res.data.message || "Login failed");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role",  res.data.user.role);
      localStorage.setItem("user",  JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!phone) return alert("Enter phone number");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/send-otp", { phone });
      if (res.data.success) {
        setOtpSent(true);
      } else {
        alert(res.data.message || "OTP send failed");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/verify-otp", { phone, otp });
      if (!res.data.success) return alert(res.data.message || "OTP verification failed");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role",  res.data.user?.role || "customer");
      localStorage.setItem("user",  JSON.stringify(res.data.user));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ NO bg-white wrapper — AuthPage provides the card
    <div className="space-y-3">

      {/* Toggle */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }}>
        <button
          onClick={() => { setMode("email"); setOtpSent(false); }}
          className="flex-1 py-2 rounded-lg text-sm transition-all duration-200"
          style={{
            background: mode === "email" ? "rgba(255,255,255,0.15)" : "transparent",
            color: mode === "email" ? "#fff" : "rgba(255,255,255,0.4)",
            border: "none",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          Email
        </button>
        <button
          onClick={() => { setMode("phone"); setOtpSent(false); }}
          className="flex-1 py-2 rounded-lg text-sm transition-all duration-200"
          style={{
            background: mode === "phone" ? "rgba(255,255,255,0.15)" : "transparent",
            color: mode === "phone" ? "#fff" : "rgba(255,255,255,0.4)",
            border: "none",
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          Phone
        </button>
      </div>

      {/* Email Login */}
      {mode === "email" && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />
          <button
            onClick={loginWithPassword}
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "#0a0814",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </>
      )}

      {/* Phone / OTP Login */}
      {mode === "phone" && (
        <>
          <input
            type="text"
            placeholder="Phone number (e.g. 9876543210)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={otpSent}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: otpSent ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              opacity: otpSent ? 0.5 : 1,
            }}
          />

          {!otpSent ? (
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.9)",
                color: "#0a0814",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          ) : (
            <>
              <p className="text-xs text-center" style={{ color: "#5dd68c" }}>
                OTP sent to {phone} ✓
              </p>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none text-center tracking-widest"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: "18px",
                  letterSpacing: "0.4em",
                }}
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#0a0814",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={() => { setOtpSent(false); setOtp(""); }}
                className="w-full text-xs text-center underline py-1"
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
              >
                Change number
              </button>
            </>
          )}
        </>
      )}

      <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
        By continuing, you agree to{" "}
        <span className="underline cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>Terms</span>{" "}
        and{" "}
        <span className="underline cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>Privacy</span>.
      </p>
    </div>
  );
}

export default CustomerLogin;