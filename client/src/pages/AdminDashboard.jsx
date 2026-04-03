import { Link, useNavigate } from "react-router-dom";
import AdminOrdersGraph from "./AdminOrdersGraph";

function AdminDashboard() {
  const navigate = useNavigate();

  // ✅ FIXED: Only remove auth keys, not entire localStorage (cart etc. safe)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold rounded-2xl">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Links */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <Link
          to="/add-cracker"
          className="bg-blue-500 text-white p-6 rounded shadow text-center hover:bg-blue-600"
        >
          Add Crackers
        </Link>

        <Link
          to="/crackers"
          className="bg-green-500 text-white p-6 rounded shadow text-center hover:bg-green-600"
        >
          View Crackers
        </Link>

        {/* ✅ FIXED: was /orders — now /admin-orders */}
        <Link
          to="/admin-orders"
          className="bg-purple-500 text-white p-6 rounded shadow text-center hover:bg-purple-600"
        >
          View Orders
        </Link>

        <Link
          to="/admin-crackers"
          className="bg-orange-500 text-white p-6 rounded shadow text-center hover:bg-orange-600"
        >
          Manage Crackers
        </Link>
      </div>

      {/* Admin Orders Graph */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Orders Overview</h2>
        <AdminOrdersGraph />
      </div>
    </div>
  );
}

export default AdminDashboard;