
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view orders");
          setLoading(false);
          return;
        }

        const res = await axios.get("https://crackersmart-2.onrender.com/api/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orderList = res.data.orders || res.data || [];
        setOrders(orderList);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pb-20">
      {/* HEADER */}
      <motion.div
        className="text-center pt-12 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs tracking-widest text-gray-400 mb-2">
          Your Purchase History
        </p>
        <h1 className="text-5xl font-bold text-orange-500">
          MY ORDERS
        </h1>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4">
        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center py-24 gap-4">
            <motion.div
              className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p className="text-gray-400">Loading orders...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No orders yet</p>
          </div>
        )}

        {/* ORDERS */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const isOpen = expandedOrder === order._id;
              const itemCount = order.items?.length || 0;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm"
                >
                  {/* HEADER */}
                  <button
                    onClick={() =>
                      setExpandedOrder(isOpen ? null : order._id)
                    }
                    className="w-full px-5 py-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleString()} · {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-lg font-bold text-orange-500">
                        ₹{order.amount}
                      </p>
                    </div>
                  </button>

                  {/* EXPANDED */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-gray-100"
                      >
                        <div className="p-4 space-y-3 bg-white">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 border p-3 rounded-lg"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 object-cover rounded"
                                />
                              )}

                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-400">
                                  ₹{item.price} × {item.qty}
                                </p>
                              </div>

                              <p className="font-bold text-orange-500">
                                ₹{item.price * item.qty}
                              </p>
                            </div>
                          ))}

                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-500 text-sm">
                              Order Total
                            </span>
                            <span className="font-bold text-orange-500">
                              ₹{order.amount}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
