import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

function Spark({ x, y, color }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{ left: x, top: y }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{ y: -60, x: (Math.random() - 0.5) * 80, scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
    </motion.div>
  );
}

function useSparks() {
  const [sparks, setSparks] = useState([]);
  const fire = (e) => {
    const colors = ["#ff6b00", "#ffd700", "#ff3d00", "#ffffff", "#ffa500"];
    const newSparks = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() - 0.5) * 20,
      y: e.clientY + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setSparks((s) => [...s, ...newSparks]);
    setTimeout(() => setSparks((s) => s.filter((sp) => !newSparks.find((n) => n.id === sp.id))), 900);
  };
  return { sparks, fire };
}

function TiltCard({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [8, -8]);
  const rotateY = useTransform(x, [-60, 60], [-8, 8]);
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function Stars({ n = 4 }) {
  return (
    <span className="text-yellow-400 text-sm tracking-wider">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

export default function CrackerList() {
  const [crackers, setCrackers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cartToast, setCartToast] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sparks, fire } = useSparks();

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
    setDebouncedSearch(urlSearch);
  }, []);

  useEffect(() => { fetchCrackers(); }, []);

  const fetchCrackers = async () => {
    try {
      const res = await axios.get("https://crackersmart-2.onrender.com/crackers");
      setCrackers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setSearchParams({ search });
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleBuyNow = (item, e) => {
    fire(e);
    localStorage.setItem("cart", JSON.stringify([{ ...item, qty: 1 }]));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartToast(`Buying ${item.name}...`);
    setTimeout(() => { setCartToast(null); navigate("/cart"); }, 900);
  };

  const handleAddToCart = (item, e) => {
    fire(e);
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = existing.findIndex((i) => i._id === item._id);
    if (idx > -1) existing[idx].qty += 1;
    else existing.push({ ...item, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(existing));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartToast(`🎆 ${item.name} added!`);
    setTimeout(() => setCartToast(null), 2000);
  };

  const toggleWishlist = (id) =>
    setWishlist((w) => w.includes(id) ? w.filter((i) => i !== id) : [...w, id]);

  const filtered = crackers
    .filter((c) => c.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    .filter((c) => (inStockOnly ? c.stock > 0 : true))
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`.bebas{font-family:'Bebas Neue',sans-serif;} .syne{font-family:'Syne',sans-serif;}`}</style>

      {sparks.map((s) => <Spark key={s.id} {...s} />)}

      {/* ── ENTIRE PAGE: WHITE BACKGROUND ── */}
      <div className="syne min-h-screen pb-24 relative overflow-x-hidden" style={{ background: "#ffffff" }}>

        {/* HERO — dark banner on top */}
        <motion.div
          className="relative text-center px-6 pt-16 pb-10 z-10"
          style={{ background: "radial-gradient(ellipse at 20% 0%,#1a0800 0%,#0a0604 100%)" }}
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(#ff6b00,transparent)" }} />

          <p className="bebas text-xs tracking-[6px] mb-3"
            style={{ background: "linear-gradient(90deg,#ff6b00,#ffd700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ✦ Diwali Festival Collection ✦
          </p>

          <h1 className="bebas leading-none tracking-widest mb-5"
            style={{ fontSize: "clamp(52px,10vw,110px)", background: "linear-gradient(160deg,#fff 0%,#ffd180 40%,#ff6b00 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BLAST<br />ZONE
          </h1>

          <p className="text-amber-600 font-semibold text-sm tracking-wide">
            Premium firecrackers · Free shipping above ₹999
          </p>
          <div className="w-28 h-px mx-auto mt-6 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          {/* STATS inside dark hero */}
          {crackers.length > 0 && (
            <div className="flex items-center justify-center gap-8 pt-8">
              {[
                { num: crackers.length, label: "Products" },
                { num: crackers.filter((c) => c.stock > 0).length, label: "In Stock" },
                { num: "50%", label: "Max Off" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-orange-900/30" />}
                  <div className="text-center">
                    <div className="bebas text-4xl text-orange-500 leading-none">{s.num}</div>
                    <div className="text-[10px] text-orange-700/70 tracking-[2px] uppercase mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── FILTER BAR — WHITE ── */}
        <motion.div
          className="sticky top-0 z-50 flex flex-wrap gap-3 items-center justify-center px-5 py-3 border-b border-gray-500 shadow-sm"
          style={{ background: "#ffffff" }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search crackers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 transition-all duration-200"
              style={{ background: "#f5f5f5", border: "1.5px solid #e0e0e0", outline: "none" }}
              onFocus={(e) => (e.target.style.borderColor = "#ff6b00")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 cursor-pointer outline-none"
            style={{ background: "#f5f5f5", border: "1.5px solid #e0e0e0" }}
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

          <label
            className="flex items-center gap-2 cursor-pointer text-[11px] font-bold tracking-widest text-gray-500 hover:text-orange-500 transition-colors duration-200 uppercase select-none"
            onClick={() => setInStockOnly((v) => !v)}
          >
            <div className={`w-4 h-4 rounded grid place-items-center flex-shrink-0 transition-all duration-200 border-2 border-orange-500 ${inStockOnly ? "bg-orange-500" : "bg-transparent"}`}>
              {inStockOnly && <span className="text-white text-[9px] font-black">✓</span>}
            </div>
            In Stock Only
          </label>

          <AnimatePresence>
            {debouncedSearch && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-[11px] font-bold tracking-widest text-gray-400 uppercase"
              >
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── PRODUCT GRID — WHITE BG ── */}
        <div className="px-5 pt-8 relative z-10" style={{ background: "#ffffff" }}>
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" className="text-center py-24"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-7xl mb-4">🎆</div>
                <div className="bebas text-4xl tracking-widest text-gray-300">No Crackers Found</div>
                <p className="text-gray-400 mt-2 text-sm">Try adjusting your filters</p>
              </motion.div>
            ) : (
              <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((c, i) => {
                  const originalPrice = Math.round(c.price * 2);
                  const inStock = c.stock > 0;
                  const isWished = wishlist.includes(c._id);

                  return (
                    <motion.div key={c._id} className="h-full"
                      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}>
                      <TiltCard>
                        <div
                          className="h-full rounded-2xl overflow-hidden relative border transition-all duration-300 group"
                          style={{ background: "linear-gradient(145deg,rgba(28,12,4,.97) 0%,rgba(16,7,2,.99) 100%)", borderColor: "rgba(255,100,0,0.15)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,0,0.5)")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,100,0,0.15)")}
                        >
                          <div className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(255,107,0,0.07) 0%,transparent 70%)" }} />

                          <div className="relative h-50 object-contain flex items-center justify-center overflow-hidden">
                            <img src={c.image} alt={c.name} loading="lazy"
                              className=" w-full  h-70  object-contain transition-transform duration-500 group-hover:scale-100" />
                            <div className="absolute inset-0"
                              style={{ background: "linear-gradient(to top,rgba(10,6,4,.95) 0%,rgba(10,6,4,.05) 55%,transparent 100%)" }} />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              <span className="text-white px-2 py-0.5 rounded text-[11px] font-black tracking-wide bebas"
                                style={{ background: "linear-gradient(135deg,#ff6b00,#ff3d00)" }}>🔥 50% OFF</span>
                              {!inStock && <span className="bg-zinc-700 text-white px-2 py-0.5 rounded text-[11px] font-black tracking-wide bebas">SOLD OUT</span>}
                              {inStock && c.stock < 5 && <span className="bg-amber-700 text-white px-2 py-0.5 rounded text-[11px] font-black tracking-wide bebas">LOW STOCK</span>}
                            </div>
                            <button onClick={() => toggleWishlist(c._id)}
                              className="absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center text-base transition-transform duration-200 hover:scale-110 backdrop-blur-sm"
                              style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,100,0,0.3)" }}>
                              {isWished ? "❤️" : "🤍"}
                            </button>
                          </div>

                          <div className="px-5 pt-4 pb-5">
                            <h3 className="bebas text-2xl tracking-wider text-amber-50 leading-tight mb-2">{c.name}</h3>
                            <div className="flex items-center justify-between mb-3">
                              <Stars n={i % 2 === 0 ? 5 : 4} />
                              <span className={`text-xs font-bold tracking-wide ${inStock ? "text-green-400" : "text-zinc-600"}`}>
                                {inStock ? `● ${c.stock} left` : "● Out of stock"}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-3 mb-4">
                              <span className="text-sm text-orange-900 line-through">₹{originalPrice}</span>
                              <span className="bebas text-4xl leading-none tracking-wide" style={{ color: "#ff6b00" }}>₹{c.price}</span>
                              <span className="text-[10px] font-black text-yellow-300 tracking-wider px-2 py-0.5 rounded"
                                style={{ background: "rgba(255,215,0,0.08)" }}>SAVE ₹{originalPrice - c.price}</span>
                            </div>
                            {inStock ? (
                              <div className="grid grid-cols-5 gap-2">
                                <button onClick={(e) => handleAddToCart(c, e)}
                                  className="col-span-2 py-3 rounded-xl text-xs font-bold tracking-wide text-orange-500 transition-all duration-200 hover:text-orange-400 active:scale-95"
                                  style={{ background: "rgba(255,107,0,0.08)", border: "1.5px solid rgba(255,107,0,0.35)" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff6b00")}
                                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,107,0,0.35)")}>
                                  🛒 Cart
                                </button>
                                <button onClick={(e) => handleBuyNow(c, e)}
                                  className="col-span-3 py-3 rounded-xl text-sm font-black tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                                  style={{ background: "linear-gradient(135deg,#ff6b00 0%,#ff3d00 100%)", boxShadow: "0 4px 20px rgba(255,80,0,0.35)" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 28px rgba(255,80,0,0.55)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,80,0,0.35)")}>
                                  ⚡ Buy Now
                                </button>
                              </div>
                            ) : (
                              <button disabled
                                className="w-full py-3 rounded-xl text-xs font-bold tracking-widest text-zinc-700 cursor-not-allowed uppercase"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)" }}>
                                — Unavailable —
                              </button>
                            )}
                          </div>
                        </div>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            className="fixed bottom-8 right-8 z-[9999] pointer-events-none flex items-center gap-3 px-5 py-4 rounded-2xl text-white font-bold text-sm syne"
            style={{ background: "linear-gradient(135deg,#ff6b00,#ff3d00)", boxShadow: "0 8px 32px rgba(255,80,0,0.5)" }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
            {cartToast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}