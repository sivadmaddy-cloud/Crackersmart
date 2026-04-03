import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function AdminOrdersGraph() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:5000/api/all-orders", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      // ✅ FIX: Ensure you are accessing the array. 
      // If your backend returns { orders: [...] }, use res.data.orders
      // If it returns just the array, use res.data
      const dataToSet = Array.isArray(res.data) ? res.data : res.data.orders;
      setOrders(dataToSet || []); 
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setOrders([]); // Fallback to empty array on error
    });
  }, []);

  // ✅ FIX: Added Array.isArray check to prevent the ".reduce is not a function" error
  const data = Array.isArray(orders) 
    ? orders.reduce((acc, order) => {
        const day = new Date(order.createdAt).toLocaleDateString();
        const existing = acc.find(d => d.date === day);
        
        // Ensure items exists before reducing
        const total = order.items ? order.items.reduce((sum, i) => sum + i.price * i.qty, 0) : 0;

        if (existing) {
          existing.total += total;
        } else {
          acc.push({ date: day, total });
        }

        return acc;
      }, [])
    : [];

  return (
    <div className="p-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Sales Revenue Graph</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No order data available to display.</p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersGraph;