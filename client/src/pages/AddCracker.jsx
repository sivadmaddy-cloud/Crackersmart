import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddCracker() {
  const navigate = useNavigate();

  // ✅ Read role fresh from localStorage
  const role = localStorage.getItem("role");

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Role protection
  if (role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold text-red-500">🚫 Access Denied</h2>
          <p className="text-gray-500 mt-2">You must be an admin to view this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const submit = async () => {
    // ✅ Read token fresh every time (not at component load time)
    const token = localStorage.getItem("token");

    // 🔍 Debug: log token to see if it exists
    console.log("TOKEN FROM STORAGE:", token);

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (!name || !image || !price || !stock) {
      alert("All fields are required ❗");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/crackers/add",
        {
          name,
          image,
          price: Number(price),
          stock: Number(stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SUCCESS:", response.data);
      alert("Cracker Added ✅");

      setName("");
      setImage("");
      setPrice("");
      setStock("");

      navigate("/CrackerList");
    } catch (err) {
      console.error("ADD ERROR FULL:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message;

      alert(`Error: ${message} ❌`);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-orange-500 mb-8 text-center">
          🎆 Add Cracker
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Cracker Name
            </label>
            <input
              className="border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. Flower Pot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Image URL
            </label>
            <input
              type="text"
              className="border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 rounded-xl w-full h-32 object-cover border"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">
                Price (₹)
              </label>
              <input
                type="number"
                className="border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="199"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">
                Stock
              </label>
              <input
                type="number"
                className="border border-gray-200 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-4 bg-orange-500 hover:bg-orange-600 transition text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50"
          >
            {loading ? "Adding... ⏳" : "Add Cracker 🎇"}
          </button>

          <button
            onClick={() => navigate("/CrackerList")}
            className="text-gray-400 hover:text-gray-600 text-sm text-center"
          >
            ← Back to Cracker List
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCracker;