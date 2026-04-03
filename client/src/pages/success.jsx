// import { useEffect, useState } from "react";
// import axios from "axios";


// function Success() {
//   const [status, setStatus] = useState("⏳ Saving your order...");

//   useEffect(() => {
//     const saveOrder = async () => {
//       const token     = localStorage.getItem("token");
//       const params    = new URLSearchParams(window.location.search);
//       const sessionId = params.get("session_id");

//       if (!token) {
//         setStatus("❌ Please login first.");
//         return;
//       }

//       if (!sessionId) {
//         setStatus("✅ Payment successful!");
//         return;
//       }

//       if (localStorage.getItem("orderSaved") === sessionId) {
//         setStatus("✅ Order already saved!");
//         return;
//       }

//       try {
//         // 1️⃣ Get items from Stripe
//         const res = await axios.get(
//           `http://localhost:5000/api/order/${sessionId}`
//         );
//         const { items, amount } = res.data;

//         // 2️⃣ Save to MongoDB
//         await axios.post(
//           "http://localhost:5000/api/place-order",
//           { items, amount },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         localStorage.setItem("orderSaved", sessionId);
//         setStatus("✅ Order saved successfully!");

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

//       {/* ✅ Fixed: was missing opening <a tag */}
      
//       <a href="/home"
//         className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600">
//         Continue Shopping
//       </a>
//     </div>
//   );
// }

// export default Success;


import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Success() {
  const [status, setStatus] = useState("⏳ Saving your order...");
  const called = useRef(false); // 🔥 prevents double execution

  useEffect(() => {
    if (called.current) return; // 🔥 STOP duplicate call
    called.current = true;

    const saveOrder = async () => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!token) {
        setStatus("❌ Please login first.");
        return;
      }

      if (!sessionId) {
        setStatus("✅ Payment successful!");
        return;
      }

      try {
        // ✅ 1. Get order details from Stripe
        const res = await axios.get(
          `http://localhost:5000/api/order/${sessionId}`
        );

        const { items, amount } = res.data;

        // ✅ 2. Save order to DB (WITH sessionId 🔥)
        const saveRes = await axios.post(
          "http://localhost:5000/api/place-order",
          {
            items,
            amount,
            sessionId, // 🔥 VERY IMPORTANT FIX
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (saveRes.data.message === "Order already exists") {
          setStatus("✅ Order already saved!");
        } else {
          setStatus("✅ Order saved successfully!");
        }

      } catch (err) {
        console.error("Save error:", err.response?.data || err.message);
        setStatus("❌ Failed to save order. Contact support.");
      }
    };

    saveOrder();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>

      <p className="text-lg mb-6">{status}</p>

      <a
        href="/home"
        className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
      >
        Continue Shopping
      </a>
    </div>
  );
}

export default Success;