import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ FIXED: was "adminToken" — must match what AdminLogin saves ("token")
        const token = localStorage.getItem("token");
        if (!token) { setError("Please login as admin"); setLoading(false); return; }
        const res = await axios.get("http://localhost:5000/api/all-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        if (err.response?.status === 401) setError("Session expired. Please login again");
        else if (err.response?.status === 403) setError("Admin access only");
        else setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const totalItems = orders.reduce((s, o) => s + (o.items?.length || 0), 0);

  const filtered = orders.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-syne  { font-family: 'Syne', sans-serif; }
      `}</style>

      <div className="font-syne min-h-screen bg-[#0a0604] text-orange-50 pb-20 relative overflow-x-hidden">

        {/* BG blobs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-orange-900/15 rounded-full blur-3xl" />
        </div>

        {/* HERO */}
        <motion.div
          className="relative z-10 text-center pt-14 pb-8 px-6"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-bebas text-xs tracking-[6px] bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent mb-2">
            ✦ Admin Dashboard ✦
          </p>
          <h1 className="font-bebas text-6xl md:text-8xl leading-none tracking-widest bg-gradient-to-b from-white via-orange-200 to-red-500 bg-clip-text text-transparent">
            ALL ORDERS
          </h1>
          <div className="w-28 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-5" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <motion.div
                className="w-14 h-14 rounded-full border-4 border-orange-900 border-t-orange-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="font-bebas text-2xl tracking-widest text-orange-800">Loading Orders...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <motion.div className="flex flex-col items-center py-24 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-6xl">🔒</div>
              <p className="font-bebas text-3xl tracking-widest text-orange-900">{error}</p>
            </motion.div>
          )}

          {!loading && !error && (
            <>
              {/* STATS ROW */}
              <motion.div
                className="grid grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  { label: "Total Orders",  value: orders.length,                    icon: "📦" },
                  { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰" },
                  { label: "Items Sold",    value: totalItems,                        icon: "🎆" },
                ].map((s, i) => (
                  <div key={i} className="bg-gradient-to-br from-[#1e0e04]/90 to-[#120902]/95 border border-orange-950/50 rounded-2xl p-4 text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="font-bebas text-2xl text-orange-500 leading-none">{s.value}</div>
                    <div className="text-[10px] text-orange-900 uppercase tracking-widest font-bold mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* SEARCH BAR */}
              <motion.div
                className="mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-700 text-sm pointer-events-none">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, email or order ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.04] border border-orange-900/40 rounded-xl pl-10 pr-4 py-3 text-sm text-orange-50 placeholder-orange-900/60 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 transition-all font-syne"
                  />
                </div>
              </motion.div>

              {/* EMPTY */}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center py-20 gap-3">
                  <div className="text-6xl">📭</div>
                  <p className="font-bebas text-3xl tracking-widest text-orange-950">No Orders Found</p>
                </div>
              )}

              {/* ORDERS */}
              <div className="space-y-4">
                {filtered.map((order, i) => {
                  const isOpen = expandedOrder === order._id;
                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="bg-gradient-to-br from-[#1e0e04]/90 to-[#120902]/95 border border-orange-950/50 hover:border-red-700/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl"
                    >
                      {/* Header */}
                      <button
                        onClick={() => setExpandedOrder(isOpen ? null : order._id)}
                        className="w-full text-left px-5 py-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center text-xl shrink-0">
                              👤
                            </div>
                            <div>
                              <p className="font-bebas text-xl tracking-wider text-orange-50 leading-none">
                                {order.name || "Customer"}
                              </p>
                              <p className="text-xs text-orange-800 mt-0.5 font-semibold tracking-wide">
                                {order.email} · #{order._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-[11px] text-orange-900 mt-0.5">
                                {new Date(order.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:shrink-0">
                            <div className="text-right">
                              <p className="text-[10px] text-orange-900 uppercase tracking-widest font-bold">Total</p>
                              <p className="font-bebas text-2xl text-orange-500 leading-none">₹{order.amount}</p>
                            </div>
                            <span className="bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                              ✓ Paid
                            </span>
                            <motion.span
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              className="text-orange-700 text-lg"
                            >
                              ▾
                            </motion.span>
                          </div>
                        </div>
                      </button>

                      {/* Items */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-orange-950/60 px-5 py-4 space-y-3">
                              {order.items?.map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="flex items-center gap-4 bg-white/[0.02] border border-orange-950/40 rounded-xl p-3"
                                >
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-14 h-14 object-cover rounded-lg shrink-0 border border-orange-900/30"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-orange-100 text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-orange-800 mt-0.5">₹{item.price} × {item.qty}</p>
                                  </div>
                                  <p className="font-bebas text-xl text-orange-500 shrink-0">
                                    ₹{item.price * item.qty}
                                  </p>
                                </motion.div>
                              ))}
                              <div className="flex justify-between items-center pt-2 border-t border-orange-950/40">
                                <span className="text-xs text-orange-800 font-bold uppercase tracking-widest">Order Total</span>
                                <span className="font-bebas text-2xl text-orange-400">₹{order.amount}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}