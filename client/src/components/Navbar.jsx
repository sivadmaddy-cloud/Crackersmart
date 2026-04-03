import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Load user AND role from localStorage
  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try { setUser(JSON.parse(data)); }
      catch { setUser(null); }
    }
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("cart");
    try {
      const cart = data ? JSON.parse(data) : [];
      setCartCount(cart.length);
    } catch { setCartCount(0); }
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const data = localStorage.getItem("cart");
      try {
        const cart = data ? JSON.parse(data) : [];
        setCartCount(cart.length);
      } catch { setCartCount(0); }
    };
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Clear role on logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // ✅ Orders link: admin vs customer
  const ordersPath = role === "admin" ? "/admin-orders" : "/orders";

  // ✅ Reviews link added between Shop and My Orders
  const navLinks = [
    { to: "/home",     label: "Home"      },
    { to: "/crackers", label: "Shop"      },
    { to: "/reviews",  label: "Reviews"   }, // ✅ NEW
    ...(user ? [{ to: ordersPath, label: "My Orders" }] : []),
  ];

  const displayName = user?.name || user?.email || "User";

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_30px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

          {/* LOGO */}
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-orange-400 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-orange-200">
              M
            </span>
            <span
              className="text-xl font-bold text-gray-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Cracker<span className="text-orange-500">Shop</span>
            </span>
          </Link>

          {/* CENTER NAV LINKS (desktop) */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive(link.to)
                      ? "text-orange-600 bg-orange-50 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="text-base leading-none">{link.icon}</span>
                  {link.label}
                  {isActive(link.to) && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full"
                    />
                  )}
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li className="w-px h-5 bg-gray-200 mx-2" />

            {/* AI Assistant Button */}
            <li>
              <button
                onClick={() => navigate("/ai")}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-violet-600 bg-violet-50 border border-violet-100 hover:bg-violet-100 hover:border-violet-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-violet-100 transition-all duration-200"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                </span>
                AI Assistant
              </button>
            </li>
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">

            {/* CART ICON */}
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:bg-orange-50 hover:border-orange-100 hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              🛒
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                {/* USER AVATAR PILL */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full pl-1 pr-3 py-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className="text-sm font-medium text-gray-700 max-w-[90px] truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {displayName}
                  </span>
                  {/* ✅ Show role badge */}
                  {role === "admin" && (
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  className="text-sm font-semibold text-red-500 bg-red-50 border border-red-100 px-4 py-2 rounded-xl hover:bg-red-100 hover:border-red-200 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                className="text-sm font-semibold text-white bg-orange-500 px-5 py-2 rounded-xl hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* HAMBURGER (mobile) */}
            <button
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl bg-gray-50 border border-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-gray-600 rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-gray-600 rounded-full"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-0.5 bg-gray-600 rounded-full"
              />
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive(link.to)
                        ? "text-orange-600 bg-orange-50 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}

                {/* AI Assistant — mobile */}
                <button
                  onClick={() => { navigate("/ai"); setMobileOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-violet-600 bg-violet-50 transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                  </span>
                  AI Assistant
                </button>

                {user && (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 bg-red-50 mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span>🚪</span> Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

export default Navbar;