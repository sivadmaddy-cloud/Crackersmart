import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Inline styles (no Tailwind needed beyond what's already in project) ───
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #0f0f0f;
    --surface: #1a1a1a;
    --surface2: #242424;
    --border: #2e2e2e;
    --accent: #ff6b2b;
    --accent2: #ffb347;
    --green: #22c55e;
    --red: #ef4444;
    --text: #f0f0f0;
    --muted: #888;
  }

  .acm-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .acm-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
  }

  /* ── Header ── */
  .acm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 36px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .acm-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.5px;
  }
  .acm-logo span { color: var(--accent); }
  .acm-header-actions { display: flex; gap: 12px; align-items: center; }

  /* ── Buttons ── */
  .btn {
    border: none; cursor: pointer; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    transition: all 0.15s ease; display: flex; align-items: center; gap: 7px;
  }
  .btn-primary {
    background: var(--accent); color: #fff;
    padding: 10px 18px;
  }
  .btn-primary:hover { background: #e55a1e; transform: translateY(-1px); }
  .btn-ghost {
    background: var(--surface2); color: var(--text);
    padding: 10px 16px; border: 1px solid var(--border);
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger {
    background: transparent; color: var(--red);
    padding: 7px 12px; border: 1px solid transparent;
    font-size: 13px; border-radius: 8px;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.12); border-color: var(--red); }
  .btn-edit {
    background: transparent; color: var(--accent2);
    padding: 7px 12px; border: 1px solid transparent;
    font-size: 13px; border-radius: 8px;
  }
  .btn-edit:hover { background: rgba(255,179,71,0.12); border-color: var(--accent2); }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* ── Main layout ── */
  .acm-body { padding: 32px 36px; max-width: 1200px; margin: 0 auto; }

  /* ── Stats row ── */
  .acm-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px 22px;
  }
  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; }
  .stat-value.orange { color: var(--accent); }
  .stat-value.green  { color: var(--green); }
  .stat-value.yellow { color: var(--accent2); }
  .stat-value.white  { color: var(--text); }

  /* ── Toolbar ── */
  .acm-toolbar {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px; gap: 16px;
  }
  .acm-search {
    flex: 1; max-width: 320px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px;
    color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .acm-search:focus { border-color: var(--accent); }
  .acm-search::placeholder { color: var(--muted); }

  /* ── Table ── */
  .acm-table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .acm-table { width: 100%; border-collapse: collapse; }
  .acm-table thead tr {
    background: var(--surface2); border-bottom: 1px solid var(--border);
  }
  .acm-table th {
    padding: 13px 18px; text-align: left;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.9px;
    color: var(--muted); font-weight: 600;
  }
  .acm-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .acm-table tbody tr:last-child { border-bottom: none; }
  .acm-table tbody tr:hover { background: var(--surface2); }
  .acm-table td { padding: 14px 18px; font-size: 14px; vertical-align: middle; }

  .cracker-img {
    width: 48px; height: 48px; border-radius: 10px;
    object-fit: cover; border: 1px solid var(--border);
    background: var(--surface2);
  }
  .cracker-name { font-weight: 500; font-size: 15px; }
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
  }
  .badge-green { background: rgba(34,197,94,0.15); color: var(--green); }
  .badge-red   { background: rgba(239,68,68,0.15); color: var(--red); }
  .badge-yellow{ background: rgba(255,179,71,0.15); color: var(--accent2); }

  /* ── Empty state ── */
  .empty-state {
    text-align: center; padding: 60px 20px; color: var(--muted);
  }
  .empty-state .es-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state p { font-size: 15px; }

  /* ── Modal overlay ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(4px);
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; width: 100%; max-width: 460px;
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  .modal-title {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
    margin-bottom: 24px; display: flex; align-items: center; gap: 10px;
  }
  .modal-title span { color: var(--accent); }

  /* ── Form ── */
  .form-group { margin-bottom: 16px; }
  .form-label {
    display: block; font-size: 12px; color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 7px;
  }
  .form-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 11px 14px; color: var(--text);
    font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .img-preview {
    margin-top: 8px; width: 100%; height: 110px; border-radius: 10px;
    object-fit: cover; border: 1px solid var(--border);
  }
  .modal-footer {
    display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;
  }

  /* ── Confirm delete modal ── */
  .confirm-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 32px; width: 100%; max-width: 380px;
    text-align: center; animation: slideUp 0.2s ease;
  }
  .confirm-icon { font-size: 44px; margin-bottom: 12px; }
  .confirm-title {
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700;
    margin-bottom: 8px;
  }
  .confirm-text { color: var(--muted); font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
  .confirm-footer { display: flex; gap: 10px; justify-content: center; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 14px 20px;
    display: flex; align-items: center; gap: 10px;
    font-size: 14px; z-index: 300; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.25s ease;
    min-width: 220px;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  .toast.success { border-color: var(--green); }
  .toast.error   { border-color: var(--red); }
  .toast-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .toast.success .toast-dot { background: var(--green); }
  .toast.error   .toast-dot { background: var(--red); }

  /* ── Loading spinner ── */
  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg) } }

  /* ── Logout btn ── */
  .btn-logout {
    background: rgba(239,68,68,0.12); color: var(--red);
    border: 1px solid rgba(239,68,68,0.25); padding: 9px 16px;
    border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 500;
    transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .btn-logout:hover { background: rgba(239,68,68,0.2); }
`;

// ─── Toast component ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`toast ${type}`}>
      <div className="toast-dot" />
      {message}
    </div>
  );
}

// ─── CrackerFormModal (Add / Edit) ─────────────────────────────────────────
function CrackerFormModal({ mode, cracker, onClose, onSuccess }) {
  const token = localStorage.getItem("token");
  const [name,  setName]  = useState(cracker?.name  || "");
  const [image, setImage] = useState(cracker?.image || "");
  const [price, setPrice] = useState(cracker?.price || "");
  const [stock, setStock] = useState(cracker?.stock || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !image || !price || !stock) {
      onSuccess("error", "All fields are required ❗");
      return;
    }
    setLoading(true);
    try {
      const payload = { name, image, price: Number(price), stock: Number(stock) };
      const headers = { Authorization: `Bearer ${token}` };

      if (mode === "add") {
        await axios.post("https://crackersmart-2.onrender.com/crackers/add", payload, { headers });
        onSuccess("success", "Cracker added successfully 🎆");
      } else {
        await axios.put(`https://crackersmart-2.onrender.com/crackers/${cracker._id}`, payload, { headers });
        onSuccess("success", "Cracker updated ✅");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      onSuccess("error", `Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          <span>{mode === "add" ? "🎆" : "✏️"}</span>
          {mode === "add" ? "Add New Cracker" : "Edit Cracker"}
        </div>

        <div className="form-group">
          <label className="form-label">Cracker Name</label>
          <input className="form-input" placeholder="e.g. Flower Pot" value={name}
            onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" placeholder="https://..." value={image}
            onChange={e => setImage(e.target.value)} />
          {image && (
            <img src={image} alt="preview" className="img-preview"
              onError={e => e.target.style.display = "none"} />
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price (₹)</label>
            <input className="form-input" type="number" placeholder="199"
              value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Stock</label>
            <input className="form-input" type="number" placeholder="50"
              value={stock} onChange={e => setStock(e.target.value)} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit} disabled={loading}>
            {loading ? <><div className="spinner" /> Saving…</> : mode === "add" ? "Add Cracker" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ConfirmDeleteModal ────────────────────────────────────────────────────
function ConfirmDeleteModal({ cracker, onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="confirm-modal">
        <div className="confirm-icon">🗑️</div>
        <div className="confirm-title">Delete Cracker?</div>
        <p className="confirm-text">
          Are you sure you want to delete <strong style={{ color: "var(--accent)" }}>{cracker.name}</strong>?<br />
          This action cannot be undone.
        </p>
        <div className="confirm-footer">
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "10px 20px" }}>Cancel</button>
          <button className="btn" onClick={onConfirm} disabled={loading}
            style={{ background: "var(--red)", color: "#fff", padding: "10px 20px", borderRadius: 10 }}>
            {loading ? <><div className="spinner" /> Deleting…</> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function AdminCrackersManager() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [crackers, setCrackers]     = useState([]);
  const [search,   setSearch]       = useState("");
  const [pageLoad, setPageLoad]     = useState(true);

  // Modal state
  const [addOpen,    setAddOpen]    = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget,  setDelTarget]  = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => setToast({ type, message });

  // ── Fetch crackers ──
  const fetchCrackers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://crackersmart-2.onrender.com/crackers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrackers(res.data);
    } catch (err) {
      showToast("error", "Failed to load crackers");
    } finally {
      setPageLoad(false);
    }
  };

  useEffect(() => { fetchCrackers(); }, []);

  // ── Delete ──
  const handleDelete = async () => {
    setDelLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://crackersmart-2.onrender.com/crackers/${delTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("success", `"${delTarget.name}" deleted`);
      setDelTarget(null);
      fetchCrackers();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Delete failed");
    } finally {
      setDelLoading(false);
    }
  };

  // ── Modal success callback ──
  const handleFormSuccess = (type, message) => {
    showToast(type, message);
    if (type === "success") {
      setAddOpen(false);
      setEditTarget(null);
      fetchCrackers();
    }
  };

  // ── Stats ──
  const totalStock    = crackers.reduce((s, c) => s + (c.stock || 0), 0);
  const totalValue    = crackers.reduce((s, c) => s + (c.price || 0) * (c.stock || 0), 0);
  const lowStock      = crackers.filter(c => c.stock < 10).length;

  // ── Filter ──
  const filtered = crackers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Stock badge ──
  const stockBadge = (s) => {
    if (s === 0) return <span className="badge badge-red">Out of Stock</span>;
    if (s < 10)  return <span className="badge badge-yellow">Low Stock</span>;
    return <span className="badge badge-green">In Stock</span>;
  };

  // ── Access guard ──
  if (role !== "admin") {
    return (
      <div className="acm-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🚫</div>
          <h2 style={{ fontFamily: "Syne", fontSize: 22, marginBottom: 8 }}>Access Denied</h2>
          <p style={{ color: "var(--muted)", marginBottom: 20 }}>Admins only.</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="acm-root">

        {/* ── Header ── */}
        <header className="acm-header">
          <div className="acm-logo">🎇 Cracker<span>Admin</span></div>
          <div className="acm-header-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/admin-dashboard")}>
              ← Dashboard
            </button>
            <button className="btn-logout" onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}>
              Logout
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <main className="acm-body">

           {/* ✅ QUICK TEST */}
  <div className="relative h-60 overflow-hidden border">
    <img
      src="https://placehold.co/600x400"
      className="w-full h-full object-contain"
    />
  </div>

          {/* ── Stats ── */}
          <div className="acm-stats">
            <div className="stat-card">
              <div className="stat-label">Total Crackers</div>
              <div className="stat-value white">{crackers.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Stock</div>
              <div className="stat-value orange">{totalStock.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Inventory Value</div>
              <div className="stat-value green">₹{totalValue.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Low / Out of Stock</div>
              <div className="stat-value yellow">{lowStock}</div>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="acm-toolbar">
            <input
              className="acm-search"
              placeholder="🔍  Search crackers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
              + Add Cracker
            </button>
          </div>

          {/* ── Table ── */}
          <div className="acm-table-wrap">
            {pageLoad ? (
              <div className="empty-state">
                <div className="es-icon">⏳</div>
                <p>Loading crackers…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="es-icon">🎆</div>
                <p>{search ? "No crackers match your search." : "No crackers yet. Add your first one!"}</p>
              </div>
            ) : (
              <table className="acm-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c._id}>
                      <td>
                        <img
                          src={c.image}
                          alt={c.name}
                          className="cracker-img"
                          onError={e => { e.target.src = "https://placehold.co/48x48/1a1a1a/888?text=🎆"; }}
                        />
                      </td>
                      <td><span className="cracker-name">{c.name}</span></td>
                      <td style={{ color: "var(--accent2)", fontWeight: 600 }}>₹{c.price}</td>
                      <td>{c.stock}</td>
                      <td>{stockBadge(c.stock)}</td>
                      <td style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <button className="btn btn-edit" onClick={() => setEditTarget(c)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => setDelTarget(c)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* ── Modals ── */}
        {addOpen && (
          <CrackerFormModal
            mode="add"
            onClose={() => setAddOpen(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {editTarget && (
          <CrackerFormModal
            mode="edit"
            cracker={editTarget}
            onClose={() => setEditTarget(null)}
            onSuccess={handleFormSuccess}
          />
        )}

        {delTarget && (
          <ConfirmDeleteModal
            cracker={delTarget}
            loading={delLoading}
            onClose={() => setDelTarget(null)}
            onConfirm={handleDelete}
          />
        )}

        {/* ── Toast ── */}
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}

export default AdminCrackersManager;