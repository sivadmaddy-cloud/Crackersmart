import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";

import { useState, useEffect } from "react";

// Pages & Components
import AuthPage from "./components/Authpage";
import Home from "./pages/Home";
import AddCracker from "./pages/AddCracker";
import CrackerList from "./pages/CrackerList";
import OrdersAdmin from "./pages/OrdersAdmin";
import MyOrders from "./pages/MyOrders";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Cart from "./pages/Cart";
import Success from "./pages/success";
import SubscribePage from "./pages/SubscribePage";
import Payment from "./pages/payment";
import AIChat from "./pages/AIChat";
import AdminCrackersManager from "./pages/Admincrackersmanager";
import CrackersReviews from "./pages/Crackersreviews"; // ✅ NEW

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role?.toLowerCase() !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function CustomerRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role?.toLowerCase() !== "customer") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Layout({ cart, setCart }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login", "/signup", "/admin-login"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/crackers" element={<CrackerList />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/reviews" element={<CrackersReviews />} /> {/* ✅ NEW */}

        {/* Customer Orders */}
        <Route path="/orders" element={<CustomerRoute><MyOrders /></CustomerRoute>} />

        {/* Admin Orders */}
        <Route path="/admin-orders" element={<AdminRoute><OrdersAdmin /></AdminRoute>} />

        <Route path="/add-cracker" element={<AdminRoute><AddCracker /></AdminRoute>} />
        <Route path="/admin-crackers" element={<AdminRoute><AdminCrackersManager /></AdminRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/ai" element={<AIChat />} />
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const updated = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(updated);
    };
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  return (
    <BrowserRouter>
      <Layout cart={cart} setCart={setCart} />
    </BrowserRouter>
  );
}

export default App;