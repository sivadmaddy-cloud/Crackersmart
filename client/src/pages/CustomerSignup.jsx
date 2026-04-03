// // import { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // function CustomerSignup() {
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [phone, setPhone] = useState("");

// //   const navigate = useNavigate();

// //   const signup = async () => {
// //     if (name === "") return alert("Name is required");

// //     if (email === "" && phone === "") {
// //       return alert("Enter Email OR Phone Number");
// //     }

// //     if (email !== "" && password === "") {
// //       return alert("Password required");
// //     }

// //     try {
// //       await axios.post("http://localhost:5000/auth/signup", {
// //         name,
// //         email,
// //         password,
// //         phone,
// //       });

// //       alert("Signup Successful");
// //       navigate("/login");

// //     } catch (error) {
// //       alert("Signup failed");
// //     }
// //   };

// //   return (
// //     <div className="space-y-4 text-center">

// //       <h2 className="text-xl text-blue-900 font-bold">Customer Signup</h2>

// //       <input
// //         placeholder="Name"
// //         value={name}
// //         onChange={(e) => setName(e.target.value)}
// //         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
// //       />

// //       <input
// //         placeholder="Email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
// //       />

// //       <input
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
// //       />

// //       <p className="text-gray-500 font-medium">OR</p>

// //       <input
// //         placeholder="Phone Number"
// //         value={phone}
// //         onChange={(e) => setPhone(e.target.value)}
// //         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
// //       />


// // <p className="text-gray-500 text-sm">
// //   By continuing, you agree to{" "}
// //   <span className="underline text-blue-900 cursor-pointer">Terms of Use</span> and{" "}
// //   <span className="underline  text-blue-900 cursor-pointer">Privacy Policy</span>.
// // </p>



// //       <button
// //         onClick={signup}
// //         className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
// //       >
// //         Signup
// //       </button>

// //     </div>
// //   );
// // }

// // export default CustomerSignup;




// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function CustomerSignup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const signup = async () => {
//     if (name.trim() === "") return alert("Name is required");
//     if (email.trim() === "") return alert("Email is required");
//     if (password.trim() === "") return alert("Password is required");

//     try {
//       setLoading(true);
//       await axios.post("http://localhost:5000/auth/signup", {
//         name: name.trim(),
//         email: email.trim(),
//         password: password.trim(),
//         role: "customer",
//       });

//       alert("Signup Successful! Please login.");
//       navigate("/login");
//     } catch (error) {
//       alert(error.response?.data?.message || "Signup failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4 text-center">
//       <h2 className="text-xl text-blue-900 font-bold">Customer Signup</h2>

//       <input
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
//       />

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full p-2 rounded-[12px] border placeholder-gray-400"
//       />

//       <p className="text-gray-500 text-sm">
//         By continuing, you agree to{" "}
//         <span className="underline text-blue-900 cursor-pointer">Terms of Use</span> and{" "}
//         <span className="underline text-blue-900 cursor-pointer">Privacy Policy</span>.
//       </p>

//       <button
//         onClick={signup}
//         disabled={loading}
//         className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition disabled:opacity-60"
//       >
//         {loading ? "Signing up..." : "Signup"}
//       </button>
//     </div>
//   );
// }

// export default CustomerSignup;
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