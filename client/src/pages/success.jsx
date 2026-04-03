// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// function Success() {
//   const [status, setStatus] = useState("⏳ Saving your order...");
//   const called = useRef(false); // 🔥 prevents double execution

//   useEffect(() => {
//     if (called.current) return; // 🔥 STOP duplicate call
//     called.current = true;

//     const saveOrder = async () => {
//       const token = localStorage.getItem("token");
//       const params = new URLSearchParams(window.location.search);
//       const sessionId = params.get("session_id");

//       if (!token) {
//         setStatus("❌ Please login first.");
//         return;
//       }

//       if (!sessionId) {
//         setStatus("✅ Payment successful!");
//         return;
//       }

//       try {
//         // ✅ 1. Get order details from Stripe
//         const res = await axios.get(
//           `https://crackersmart-2.onrender.com/api/order/${sessionId}`
//         );

//         const { items, amount } = res.data;

//         // ✅ 2. Save order to DB (WITH sessionId 🔥)
//         const saveRes = await axios.post(
//           "https://crackersmart-2.onrender.com/api/place-order",
//           {
//             items,
//             amount,
//             sessionId, // 🔥 VERY IMPORTANT FIX
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (saveRes.data.message === "Order already exists") {
//           setStatus("✅ Order already saved!");
//         } else {
//           setStatus("✅ Order saved successfully!");
//         }

//       } catch (err) {
//         console.error("Save error:", err.response?.data || err.message);
//         setStatus("❌ Failed to save order. Contact support.");
//       }
//     };

//     saveOrder();
//   }, []);

//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-3xl font-bold text-green-600 mb-4">
//         Payment Successful 🎉
//       </h1>

//       <p className="text-lg mb-6">{status}</p>

//       <a
//         href="/home"
//         className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
//       >
//         Continue Shopping
//       </a>
//     </div>
//   );
// }

// export default Success;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://crackersmart-2.onrender.com";

export default function Success() {
  const navigate  = useNavigate();
  const called    = useRef(false);
  const [state,   setState]   = useState("loading"); // loading | success | duplicate | error
  const [order,   setOrder]   = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const saveOrder = async () => {
      const token     = localStorage.getItem("token");
      const params    = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");
      const type      = params.get("type");

      // ── Subscription success (no order to save) ──
      if (type === "subscription") {
        setState("subscription");
        return;
      }

      if (!token) {
        setMessage("Please login to view your order.");
        setState("error");
        return;
      }

      if (!sessionId) {
        setState("success");
        return;
      }

      try {
        // Step 1: Fetch from Stripe
        const { data: stripeData } = await axios.get(
          `${API}/api/order/${sessionId}`
        );

        // Step 2: Save to MongoDB
        const { data: savedData } = await axios.post(
          `${API}/api/place-order`,
          { items: stripeData.items, amount: stripeData.amount, sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrder(savedData.order);
        setState("success");

        // Step 3: Clear cart
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));

      } catch (err) {
        // 409 = already saved (user refreshed page) — still show success
        if (err.response?.status === 409) {
          setOrder(err.response.data.order);
          setState("success");
          return;
        }
        console.error(err.response?.data || err.message);
        setMessage("Order placed but failed to save. Please contact support.");
        setState("error");
      }
    };

    saveOrder();
  }, []);

  // ── Loading ──
  if (state === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 font-semibold text-lg animate-pulse">
          Confirming your order...
        </p>
      </div>
    );
  }

  // ── Subscription Success ──
  if (state === "subscription") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold text-green-700 mb-2">Subscription Activated!</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          You now have access to exclusive offers, priority deals and festival discounts.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-300 hover:-translate-y-0.5 transition-all"
        >
           Go to Home
        </button>
      </div>
    );
  }

  // ── Error ──
  if (state === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
          >
             My Orders
          </button>
          <button
            onClick={() => navigate("/home")}
            className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition"
          >
             Home
          </button>
        </div>
      </div>
    );
  }

  // ── Order Success ──
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-6">

      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 fixed top-0 left-0" />

      {/* Icon */}
      <div className="bg-green-100 rounded-full p-6 mb-4 shadow-inner">
        <div className="text-6xl">✅</div>
      </div>

      <h1 className="text-4xl font-bold text-green-700 mb-1">Payment Successful!</h1>
      <p className="text-gray-400 mb-6 text-center max-w-sm">
        Thank you! Your crackers are on the way 🎆
      </p>

      {/* Order Summary Card */}
      {order && (
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mb-6 border border-orange-100">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 -mx-6 -mt-6 px-6 py-4 rounded-t-2xl mb-4">
            <h2 className="text-white font-bold text-lg">Order Summary</h2>
            <p className="text-orange-100 text-xs mt-0.5">
              ID: {order._id}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold text-gray-800">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="font-bold text-gray-700">Total Paid</span>
            <span className="text-2xl font-bold text-orange-500">
              ₹{order.amount}
            </span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate("/home")}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-base shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all"
        >
           Go to Home
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-xl font-bold text-base hover:bg-orange-50 hover:-translate-y-0.5 transition-all"
        >
          My Orders
        </button>
      </div>
    </div>
  );
}