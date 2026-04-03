// import axios from "axios";

// function Cart({ cart, setCart }) {
//   const totalPrice = cart.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   const handlePayment = async () => {
//   if (!cart.length) return alert("Cart is empty!");

//   const token = localStorage.getItem("token");

//   // ✅ Only check token (NOT user)
//   if (!token) {
//     return alert("Please login first");
//   }

//   // ✅ Safe user parsing
//   let user = {};

//   try {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser && storedUser !== "undefined") {
//       user = JSON.parse(storedUser);
//     }
//   } catch (err) {
//     console.error("User parse error:", err);
//   }

//   try {
//     const res = await axios.post(
//       "http://localhost:5000/api/create-order",
//       {
//         cart,
//         name: user?.name || "Guest",
//         email: user?.email || "guest@email.com",
//       },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (res.data.url) {
//       window.location.href = res.data.url;
//     } else {
//       alert("Stripe checkout URL not received.");
//     }

//   } catch (err) {
//     console.error("Stripe error:", err.response?.data || err);
//     alert("Payment failed");
//   }
// };

//   return (
//     <div className="p-10">
//       <h2 className="text-2xl font-bold mb-5">Your Cart</h2>

//       {cart.length === 0 ? (
//         <p>Your cart is empty 🛒</p>
//       ) : (
//         <>
//           {cart.map((item, i) => (
//             <div key={i} className="flex gap-5 border p-3 mb-3 items-center">
//               <p className="w-40">{item.name}</p>
//               <p className="w-20">₹{item.price}</p>

//               <input
//                 type="number"
//                 min="1"
//                 value={item.qty}
//                 onChange={(e) => {
//                   const updated = [...cart];
//                   updated[i].qty = parseInt(e.target.value) || 1;

//                   setCart(updated);
//                   localStorage.setItem("cart", JSON.stringify(updated));
//                 }}
//                 className="border w-16 text-center"
//               />
//             </div>
//           ))}

//           <h3 className="text-xl font-bold mt-5">
//             Total Price: ₹{totalPrice}
//           </h3>

//           <button
//             onClick={handlePayment}
//             className="bg-green-500 text-white px-6 py-2 mt-5 rounded hover:bg-green-600 transition"
//           >
//             Pay & Place Order 💳
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// export default Cart;




import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const savings = cart.reduce((sum, item) => sum + item.price * item.qty, 0); // 50% off already applied

  const updateQty = (i, val) => {
    const updated = [...cart];
    updated[i].qty = Math.max(1, parseInt(val) || 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (i) => {
    const updated = cart.filter((_, idx) => idx !== i);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handlePayment = async () => {
    if (!cart.length) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    let user = {};
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") user = JSON.parse(storedUser);
    } catch (err) { console.error(err); }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/create-order",
        { cart, name: user?.name || "Guest", email: user?.email || "guest@email.com" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.url) window.location.href = res.data.url;
      else alert("Stripe checkout URL not received.");
    } catch (err) {
      console.error("Stripe error:", err.response?.data || err);
      alert("Payment failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-syne  { font-family: 'Syne', sans-serif; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div className="font-syne min-h-screen bg-white text-gray-900 pb-24 relative overflow-x-hidden">

        {/* Subtle warm top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-red-500 to-orange-600" />

        {/* Decorative background shapes */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl" />
        </div>

        {/* HERO */}
        <motion.div
          className="relative z-10 text-center pt-12 pb-8 px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-bebas text-xs tracking-[6px] text-orange-500 mb-2">
            ✦ Review Your Selection ✦
          </p>
          <h1 className="font-bebas text-6xl md:text-8xl leading-none tracking-widest bg-gradient-to-b from-gray-900 via-gray-800 to-orange-600 bg-clip-text text-transparent">
            YOUR CART
          </h1>
          <div className="w-28 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-5" />
        </motion.div>

        {/* EMPTY STATE */}
        {cart.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24 gap-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div className="text-8xl">🛒</div>
            <p className="font-bebas text-4xl tracking-widest text-gray-300">Cart Is Empty</p>
            <p className="text-gray-400 text-sm">Go grab some crackers first!</p>
            <button
              onClick={() => navigate("/home")}
              className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200 font-syne"
            >
              🎆 Shop Now
            </button>
          </motion.div>
        )}

        {cart.length > 0 && (
          <div className="relative z-10 max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ── LEFT: Items ── */}
            <div>
              {/* Items count header */}
              <motion.div
                className="flex items-center justify-between mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <p className="font-bebas text-2xl tracking-widest text-gray-800">
                  {totalItems} ITEM{totalItems !== 1 ? "S" : ""}
                </p>
                <button
                  onClick={() => { setCart([]); localStorage.removeItem("cart"); }}
                  className="text-xs text-red-400 hover:text-red-600 font-bold tracking-wide transition-colors"
                >
                  Clear All ✕
                </button>
              </motion.div>

              {/* Item cards */}
              <div className="space-y-3">
                <AnimatePresence>
                  {cart.map((item, i) => (
                    <motion.div
                      key={item._id || i}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                      className="bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-4 flex gap-4 items-center shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {/* Image */}
                      {item.image && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bebas text-xl tracking-wider text-gray-800 leading-tight truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 line-through">₹{item.price * 2}</span>
                          <span className="text-orange-500 font-bold text-sm">₹{item.price}</span>
                          <span className="bg-orange-50 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded border border-orange-100">50% OFF</span>
                        </div>
                      </div>

                      {/* Qty control */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => updateQty(i, item.qty - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-all text-sm"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateQty(i, e.target.value)}
                          className="w-10 h-8 text-center border border-gray-200 rounded-lg text-sm font-bold text-gray-800 outline-none focus:border-orange-400 transition-colors"
                        />
                        <button
                          onClick={() => updateQty(i, item.qty + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 hover:border-orange-400 hover:bg-orange-50 flex items-center justify-center text-gray-600 hover:text-orange-600 font-bold transition-all text-sm"
                        >
                          +
                        </button>
                      </div>

                      {/* Item total */}
                      <div className="text-right shrink-0">
                        <p className="font-bebas text-2xl text-orange-500 leading-none">
                          ₹{item.price * item.qty}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(i)}
                        className="w-8 h-8 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center text-lg transition-all shrink-0"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <motion.div
              className="lg:sticky lg:top-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                {/* Summary header */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
                  <p className="font-bebas text-2xl tracking-widest text-white">Order Summary</p>
                </div>

                <div className="p-6 space-y-4">
                  {/* Line items */}
                  <div className="space-y-2">
                    {cart.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500 truncate max-w-[160px]">{item.name} × {item.qty}</span>
                        <span className="font-semibold text-gray-800 shrink-0 ml-2">₹{item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Savings */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Original Price</span>
                    <span className="text-gray-400 line-through">₹{totalPrice * 2}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-semibold">🎉 You Save (50% off)</span>
                    <span className="text-green-600 font-bold">−₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className={totalPrice >= 999 ? "text-green-600 font-semibold" : "text-gray-700 font-semibold"}>
                      {totalPrice >= 999 ? "FREE 🎆" : "₹49"}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Total */}
                  <div className="flex justify-between items-baseline">
                    <span className="font-bebas text-xl tracking-wider text-gray-800">Total Payable</span>
                    <span className="font-bebas text-4xl text-orange-500 leading-none">
                      ₹{totalPrice + (totalPrice >= 999 ? 0 : 49)}
                    </span>
                  </div>

                  {/* Free shipping nudge */}
                  {totalPrice < 999 && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                      <p className="text-xs text-orange-600 font-bold">
                        Add ₹{999 - totalPrice} more for FREE shipping! 🚀
                      </p>
                      <div className="mt-2 bg-orange-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((totalPrice / 999) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Pay button */}
                  <motion.button
                    onClick={handlePayment}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200 font-syne tracking-wide"
                  >
                    💳 Pay & Place Order
                  </motion.button>

                  {/* Trust badges */}
                  <div className="flex justify-center gap-6 pt-1">
                    {["🔒 Secure", "⚡ Instant", "🎆 Authentic"].map((b) => (
                      <span key={b} className="text-[10px] text-gray-400 font-semibold">{b}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue shopping */}
              <button
                onClick={() => navigate("/home")}
                className="w-full mt-3 border border-gray-200 hover:border-orange-300 text-gray-500 hover:text-orange-600 text-sm font-bold py-3 rounded-xl transition-all duration-200 font-syne"
              >
                ← Continue Shopping
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}