// // import { useState } from "react";
// // import AdminLogin from "../pages/AdminLogin";
// // import CustomerLogin from "../pages/CustomerLogin";
// // import CustomerSignup from "../pages/CustomerSignup";
// // import bgImage from "../assets/bg10.jpg";


// // const AuthPage = () => {
// //   const [role, setRole] = useState("");
// //   const [page, setPage] = useState("");

// //   return (



// //   <div
// //   className=" min-h-screen  flex items-center justify-center bg-cover bg-center"
// //   style={{ backgroundImage: `url(${bgImage})` }}
// // >
// //   <div className="absolute inset-0 bg-black opacity-1 pointer-events-none"></div>

// //   {/* <div className="relative bg-white p-8 rounded-[15px] shadow-md w-96 space-y-6 text-center"></div> */}

// //       <div className="bg-white p-8 rounded-[15px] shadow-md w-96 space-y-6 text-center">

// //         {/* TITLE */}
// //         <h2 className="text-2xl  font-bold">Authentication</h2>

// //         {/* ROLE SELECTION */}
// //         <div className="flex justify-center gap-4">
// //           <button
// //             onClick={() => {
// //               setRole("admin");
// //               setPage("");
// //             }}
// //             className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
// //           >
// //             Admin
// //           </button>

// //           <button
// //             onClick={() => {
// //               setRole("customer");
// //               setPage("");
// //             }}
// //             className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
// //           >
// //             Customer
// //           </button>
// //         </div>

// //         {/* LOGIN / SIGNUP OPTIONS */}
// //         {role === "customer" && (
// //           <div className="flex justify-center gap-4">
// //             <button
// //               onClick={() => setPage("login")}
// //               className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
// //             >
// //               Login
// //             </button>

// //             <button
// //               onClick={() => setPage("signup")}
// //               className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
// //             >
// //               Signup
// //             </button>
// //           </div>
// //         )}

// //         <hr />

// //         {/* FORMS SECTION */}
// //         <div className="mt-4">

// //           {role === "admin" && (
// //             <div className="space-y-4">
// //               <AdminLogin />
// //             </div>
// //           )}

// //           {role === "customer" && page === "login" && (
// //             <div className="space-y-4">
// //               <CustomerLogin />
// //             </div>
// //           )}

// //           {role === "customer" && page === "signup" && (
// //             <div className="space-y-4">
// //               <CustomerSignup />
// //             </div>
// //           )}

// //         </div>

// //       </div>
// //     // </div>
// //   );
// // };

// // export default AuthPage;


// import { useState } from "react";
// import AdminLogin from "../pages/AdminLogin";
// import CustomerLogin from "../pages/CustomerLogin";
// import CustomerSignup from "../pages/CustomerSignup";
// import bgImage from "../assets/bg10.jpg";

// const AuthPage = () => {
//   const [role, setRole] = useState("");
//   const [page, setPage] = useState("");

//   const resetToHome = () => {
//     setRole("");
//     setPage("");
//   };

//   return (
//     <div className="auth-root">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

//         .auth-root {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-image: url(${bgImage});
//           background-size: cover;
//           background-position: center;
//           font-family: 'DM Sans', sans-serif;
//           position: relative;
//         }

//         .auth-root::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(10,8,20,0.82) 0%, rgba(25,15,45,0.78) 100%);
//           backdrop-filter: blur(2px);
//         }

//         .auth-card {
//           position: relative;
//           z-index: 1;
//           width: 420px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.1);
//           border-radius: 24px;
//           padding: 40px 36px;
//           backdrop-filter: blur(24px);
//           box-shadow: 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
//         }

//         .auth-brand {
//           text-align: center;
//           margin-bottom: 36px;
//           cursor: pointer;
//         }

//         .auth-brand-name {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 32px;
//           font-weight: 300;
//           color: #fff;
//           letter-spacing: 0.08em;
//           line-height: 1;
//         }

//         .auth-brand-tagline {
//           font-size: 11px;
//           color: rgba(255,255,255,0.35);
//           letter-spacing: 0.25em;
//           text-transform: uppercase;
//           margin-top: 6px;
//         }

//         .auth-divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 0 0 28px;
//         }

//         .auth-divider-line {
//           flex: 1;
//           height: 1px;
//           background: rgba(255,255,255,0.1);
//         }

//         .auth-divider-text {
//           font-size: 10px;
//           color: rgba(255,255,255,0.25);
//           letter-spacing: 0.2em;
//           text-transform: uppercase;
//         }

//         .role-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//           margin-bottom: 28px;
//         }

//         .role-btn {
//           padding: 18px 12px;
//           border-radius: 14px;
//           border: 1px solid rgba(255,255,255,0.1);
//           background: rgba(255,255,255,0.04);
//           color: rgba(255,255,255,0.55);
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px;
//           font-weight: 400;
//           letter-spacing: 0.06em;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 8px;
//         }

//         .role-btn:hover {
//           background: rgba(255,255,255,0.08);
//           color: rgba(255,255,255,0.85);
//           border-color: rgba(255,255,255,0.2);
//         }

//         .role-btn.active {
//           background: rgba(255,255,255,0.1);
//           border-color: rgba(255,255,255,0.35);
//           color: #fff;
//           box-shadow: 0 0 0 1px rgba(255,255,255,0.08) inset;
//         }

//         .role-icon {
//           width: 36px;
//           height: 36px;
//           border-radius: 10px;
//           background: rgba(255,255,255,0.07);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 16px;
//         }

//         .page-tabs {
//           display: flex;
//           gap: 4px;
//           background: rgba(255,255,255,0.05);
//           border-radius: 12px;
//           padding: 4px;
//           margin-bottom: 24px;
//         }

//         .page-tab {
//           flex: 1;
//           padding: 9px;
//           border: none;
//           border-radius: 9px;
//           background: transparent;
//           color: rgba(255,255,255,0.4);
//           font-family: 'DM Sans', sans-serif;
//           font-size: 13px;
//           font-weight: 400;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           letter-spacing: 0.04em;
//         }

//         .page-tab.active {
//           background: rgba(255,255,255,0.12);
//           color: #fff;
//         }

//         .page-tab:hover:not(.active) {
//           color: rgba(255,255,255,0.65);
//         }

//         /* ── override child form styles ── */
//         .form-wrapper input {
//           width: 100%;
//           box-sizing: border-box;
//           background: rgba(255,255,255,0.06) !important;
//           border: 1px solid rgba(255,255,255,0.1) !important;
//           border-radius: 12px !important;
//           padding: 12px 16px !important;
//           color: #fff !important;
//           font-family: 'DM Sans', sans-serif !important;
//           font-size: 14px !important;
//           outline: none !important;
//           transition: border-color 0.2s !important;
//           margin: 0 !important;
//         }

//         .form-wrapper input::placeholder {
//           color: rgba(255,255,255,0.25) !important;
//         }

//         .form-wrapper input:focus {
//           border-color: rgba(255,255,255,0.3) !important;
//           background: rgba(255,255,255,0.09) !important;
//         }

//         .form-wrapper input:disabled {
//           opacity: 0.5 !important;
//         }

//         .form-wrapper button[type="submit"],
//         .form-wrapper button:not(.page-tab):not(.role-btn):not(.tab-toggle) {
//           width: 100%;
//           padding: 13px !important;
//           border-radius: 12px !important;
//           border: none !important;
//           background: rgba(255,255,255,0.9) !important;
//           color: #0a0814 !important;
//           font-family: 'DM Sans', sans-serif !important;
//           font-size: 14px !important;
//           font-weight: 500 !important;
//           letter-spacing: 0.04em !important;
//           cursor: pointer !important;
//           transition: all 0.2s ease !important;
//           box-shadow: none !important;
//         }

//         .form-wrapper button:not(.page-tab):not(.role-btn):not(.tab-toggle):hover {
//           background: #fff !important;
//           transform: translateY(-1px) !important;
//         }

//         .form-wrapper button:not(.page-tab):not(.role-btn):not(.tab-toggle):disabled {
//           opacity: 0.5 !important;
//           transform: none !important;
//           cursor: not-allowed !important;
//         }

//         /* small ghost buttons like "Change number" */
//         .form-wrapper .ghost-btn {
//           background: transparent !important;
//           color: rgba(255,255,255,0.35) !important;
//           font-size: 12px !important;
//           text-decoration: underline !important;
//           padding: 6px !important;
//           width: auto !important;
//         }

//         .form-wrapper h2 {
//           display: none !important;
//         }

//         .form-wrapper .space-y-4 > *,
//         .form-wrapper .space-y-6 > * {
//           margin-top: 0 !important;
//         }

//         .form-wrapper .space-y-4,
//         .form-wrapper .space-y-6 {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .form-wrapper p {
//           color: rgba(255,255,255,0.3) !important;
//           font-size: 11px !important;
//           text-align: center;
//           line-height: 1.6;
//         }

//         .form-wrapper p span {
//           color: rgba(255,255,255,0.55) !important;
//         }

//         .form-wrapper .text-red-500 {
//           color: #ff6b6b !important;
//           font-size: 12px !important;
//           text-align: center;
//         }

//         .form-wrapper .text-green-600 {
//           color: #5dd68c !important;
//           font-size: 12px !important;
//           text-align: center;
//         }

//         /* OTP input special */
//         .form-wrapper input.tracking-widest {
//           letter-spacing: 0.4em !important;
//           font-size: 18px !important;
//           text-align: center !important;
//         }

//         /* phone toggle buttons inside login */
//         .form-wrapper .flex.justify-center.gap-2 {
//           background: rgba(255,255,255,0.05);
//           border-radius: 10px;
//           padding: 4px;
//           gap: 4px !important;
//         }

//         .form-wrapper .flex.justify-center.gap-2 button {
//           flex: 1 !important;
//           padding: 8px 12px !important;
//           border-radius: 8px !important;
//           font-size: 12px !important;
//           background: transparent !important;
//           color: rgba(255,255,255,0.4) !important;
//           border: none !important;
//           box-shadow: none !important;
//           width: auto !important;
//           transform: none !important;
//         }

//         .form-wrapper .flex.justify-center.gap-2 button.bg-\\[\\#6152AD\\] {
//           background: rgba(255,255,255,0.12) !important;
//           color: #fff !important;
//         }

//         .form-wrapper .bg-gray-200 {
//           background: transparent !important;
//         }

//         .form-wrapper hr {
//           display: none !important;
//         }

//         .section-label {
//           font-size: 11px;
//           color: rgba(255,255,255,0.25);
//           letter-spacing: 0.18em;
//           text-transform: uppercase;
//           text-align: center;
//           margin-bottom: 20px;
//         }

//         .back-btn {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           background: none;
//           border: none;
//           color: rgba(255,255,255,0.3);
//           font-family: 'DM Sans', sans-serif;
//           font-size: 12px;
//           cursor: pointer;
//           padding: 0;
//           margin-bottom: 20px;
//           letter-spacing: 0.04em;
//           transition: color 0.2s;
//         }

//         .back-btn:hover {
//           color: rgba(255,255,255,0.6);
//         }
//       `}</style>

//       <div className="auth-card">
//         {/* Brand */}
//         <div className="auth-brand" onClick={resetToHome}>
//           <div className="auth-brand-name">Authenticate</div>
//           <div className="auth-brand-tagline">Secure access portal</div>
//         </div>

//         {/* Step: choose role */}
//         {!role && (
//           <>
//             <div className="auth-divider">
//               <div className="auth-divider-line" />
//               <div className="auth-divider-text">Select role</div>
//               <div className="auth-divider-line" />
//             </div>

//             <div className="role-grid">
//               <button className="role-btn" onClick={() => setRole("admin")}>
//                 <div className="role-icon">⚙</div>
//                 Admin
//               </button>
//               <button className="role-btn" onClick={() => { setRole("customer"); setPage("login"); }}>
//                 <div className="role-icon">◎</div>
//                 Customer
//               </button>
//             </div>
//           </>
//         )}

//         {/* Step: Admin form */}
//         {role === "admin" && (
//           <>
//             <button className="back-btn" onClick={resetToHome}>
//               ← back
//             </button>
//             <div className="section-label">Admin access</div>
//             <div className="form-wrapper">
//               <AdminLogin />
//             </div>
//           </>
//         )}

//         {/* Step: Customer login/signup */}
//         {role === "customer" && (
//           <>
//             <button className="back-btn" onClick={resetToHome}>
//               ← back
//             </button>

//             <div className="page-tabs">
//               <button
//                 className={`page-tab ${page === "login" ? "active" : ""}`}
//                 onClick={() => setPage("login")}
//               >
//                 Sign in
//               </button>
//               <button
//                 className={`page-tab ${page === "signup" ? "active" : ""}`}
//                 onClick={() => setPage("signup")}
//               >
//                 Create account
//               </button>
//             </div>

//             <div className="form-wrapper">
//               {page === "login" && <CustomerLogin />}
//               {page === "signup" && <CustomerSignup />}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPage;


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