import { useState, useMemo } from "react";

const AVATAR_COLORS = [
  { bg: "#EEEDFE", color: "#3C3489" },
  { bg: "#E1F5EE", color: "#085041" },
  { bg: "#FAECE7", color: "#712B13" },
  { bg: "#E6F1FB", color: "#0C447C" },
  { bg: "#FBEAF0", color: "#72243E" },
  { bg: "#EAF3DE", color: "#27500A" },
  { bg: "#FAEEDA", color: "#633806" },
];

const INITIAL_REVIEWS = [
  { id: 1, name: "Arun K.", product: "Diwali Cracker Pack", rating: 5, text: "Absolutely fantastic! The crackers were vibrant and of top quality. Will order again this Diwali for sure.", date: "12 Mar 2026", helpful: 4, verified: true },
  { id: 2, name: "Meena R.", product: "Flower Pot Set", rating: 5, text: "Super fast delivery and packaging was really secure. Kids loved every single piece!", date: "10 Mar 2026", helpful: 7, verified: true },
  { id: 3, name: "Rajesh V.", product: "Ground Chakkar Box", rating: 4, text: "Good value for money. All crackers worked perfectly. Only one ground chakkar was a bit slow.", date: "5 Mar 2026", helpful: 2, verified: false },
  { id: 4, name: "Sunitha P.", product: "Sparklers Bundle", rating: 5, text: "Best sparklers I have bought online. Bright, long-lasting and delivered on time.", date: "28 Feb 2026", helpful: 9, verified: true },
  { id: 5, name: "Karthik M.", product: "Atom Bomb Pack", rating: 4, text: "Good quality but delivery took a day longer than expected. Overall happy with the purchase.", date: "25 Feb 2026", helpful: 3, verified: false },
  { id: 6, name: "Divya L.", product: "Colour Smoke Bombs", rating: 5, text: "Amazing colours! We used these for a photoshoot and they were perfect. Highly recommend.", date: "20 Feb 2026", helpful: 11, verified: true },
  { id: 7, name: "Venkat S.", product: "Diwali Combo Kit", rating: 4, text: "Nice variety in the combo kit. Good for families with kids. Safe and enjoyable.", date: "15 Feb 2026", helpful: 5, verified: true },
  { id: 8, name: "Lakshmi T.", product: "Rocket Set", rating: 5, text: "The rockets were loud and colourful — exactly what we wanted for the celebration!", date: "10 Feb 2026", helpful: 6, verified: true },
  { id: 9, name: "Pradeep N.", product: "Mini Bomb Box", rating: 3, text: "Decent quality. Some were a bit damp and did not light easily. Packaging could be better.", date: "5 Feb 2026", helpful: 1, verified: false },
  { id: 10, name: "Shalini B.", product: "Sparklers Bundle", rating: 5, text: "Ordered for my daughter's birthday and she loved it! Quick delivery and good packaging.", date: "1 Feb 2026", helpful: 8, verified: true },
  { id: 11, name: "Naresh G.", product: "Flower Pot Set", rating: 5, text: "Very bright and beautiful flower pots. All 12 pieces worked. Ordering again next season!", date: "28 Jan 2026", helpful: 3, verified: true },
  { id: 12, name: "Tara J.", product: "Ground Chakkar Box", rating: 4, text: "Good product, fast shipping. One chakkar did not spin properly but rest were fine.", date: "20 Jan 2026", helpful: 2, verified: false },
];

function getInitials(name) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(name) {
  let h = 0;
  for (const c of name) h += c.charCodeAt(0);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function formatDate(date) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function StarDisplay({ rating, size = 15 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ fontSize: size, color: i <= rating ? "#F5A623" : "#D1D5DB" }}>
          {i <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: 28,
            cursor: "pointer",
            color: i <= (hovered || value) ? "#F5A623" : "#D1D5DB",
            transition: "transform 0.1s",
            transform: i <= (hovered || value) ? "scale(1.15)" : "scale(1)",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SummaryBar({ label, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6B7280" }}>
      <span style={{ minWidth: 14 }}>{label}</span>
      <span style={{ fontSize: 12, color: "#F5A623" }}>★</span>
      <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "#F5A623",
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span style={{ minWidth: 30, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

function ReviewCard({ review, onHelpful }) {
  const col = getAvatarColor(review.name);
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "1rem 1.25rem",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: col.bg,
            color: col.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {getInitials(review.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>{review.name}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{review.date}</div>
        </div>
        {review.verified && (
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 20,
              background: "#EAF3DE",
              color: "#3B6D11",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            Verified buy
          </span>
        )}
      </div>

      {/* Stars */}
      <div style={{ marginBottom: 6 }}>
        <StarDisplay rating={review.rating} size={15} />
      </div>

      {/* Product */}
      {review.product && (
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
          Product: {review.product}
        </div>
      )}

      {/* Review text */}
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{review.text}</div>

      {/* Helpful */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12, color: "#9CA3AF" }}>
        <span>Helpful?</span>
        <button
          onClick={() => onHelpful(review.id)}
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "3px 12px",
            cursor: "pointer",
            background: "transparent",
            fontSize: 12,
            color: "#6B7280",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#F9FAFB")}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          Yes ({review.helpful})
        </button>
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState({});

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    fontFamily: "inherit",
    outline: "none",
  };

  const labelStyle = { fontSize: 13, color: "#6B7280", display: "block", marginBottom: 4 };

  function handleSubmit() {
    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!rating) errs.rating = true;
    if (!text.trim()) errs.text = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ name: name.trim(), product: product.trim(), rating, text: text.trim() });
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <p style={{ fontSize: 16, fontWeight: 500, margin: "0 0 1rem", color: "#111827" }}>
        Share your experience
      </p>

      {/* Name */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Your name *</label>
        <input
          style={{ ...inputStyle, borderColor: errors.name ? "#EF4444" : "#E5E7EB" }}
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
          placeholder="e.g. Priya S."
        />
        {errors.name && <span style={{ fontSize: 12, color: "#EF4444" }}>Please enter your name</span>}
      </div>

      {/* Product */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Product (optional)</label>
        <input
          style={inputStyle}
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="e.g. Diwali Cracker Pack"
        />
      </div>

      {/* Rating */}
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Rating *</label>
        <StarPicker value={rating} onChange={(v) => { setRating(v); setErrors((p) => ({ ...p, rating: false })); }} />
        {errors.rating && <div style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>Please select a rating</div>}
      </div>

      {/* Review text */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Your review *</label>
        <textarea
          style={{ ...inputStyle, borderColor: errors.text ? "#EF4444" : "#E5E7EB", resize: "vertical", minHeight: 80 }}
          value={text}
          onChange={(e) => { setText(e.target.value); setErrors((p) => ({ ...p, text: false })); }}
          placeholder="Tell others what you liked or didn't like..."
          rows={3}
        />
        {errors.text && <span style={{ fontSize: 12, color: "#EF4444" }}>Please write your review</span>}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 14,
            cursor: "pointer",
            color: "#6B7280",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Post review
        </button>
      </div>
    </div>
  );
}

function Toast({ visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
        background: "#111827",
        color: "#fff",
        padding: "10px 22px",
        borderRadius: 8,
        fontSize: 14,
        transition: "transform 0.3s ease",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      Review posted!
    </div>
  );
}

export default function CrackersReviews() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState("newest");
  const [toast, setToast] = useState(false);
  const [nextId, setNextId] = useState(13);

  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length)
    : 0;

  const starCounts = useMemo(() => {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => c[r.rating]++);
    return c;
  }, [reviews]);

  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === "highest") arr.sort((a, b) => b.rating - a.rating);
    else if (sort === "lowest") arr.sort((a, b) => a.rating - b.rating);
    return arr;
  }, [reviews, sort]);

  function handleHelpful(id) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
    );
  }

  function handleSubmit(data) {
    const newReview = {
      id: nextId,
      ...data,
      date: formatDate(new Date()),
      helpful: 0,
      verified: false,
    };
    setNextId((n) => n + 1);
    setReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
    setSort("newest");
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#111827" }}>Customer reviews</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {showForm ? "✕ Close" : "+ Write a review"}
        </button>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "#F9FAFB",
          borderRadius: 12,
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center", minWidth: 70 }}>
          <div style={{ fontSize: 42, fontWeight: 600, color: "#111827", lineHeight: 1 }}>
            {avg.toFixed(1)}
          </div>
          <div style={{ marginTop: 4 }}>
            <StarDisplay rating={Math.round(avg)} size={18} />
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 6 }}>
          {[5, 4, 3, 2, 1].map((s) => (
            <SummaryBar key={s} label={s} count={starCounts[s]} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <ReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
      )}

      {/* Sort */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
        <span style={{ fontSize: 13, color: "#6B7280" }}>Sort by</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 13,
            background: "#fff",
            color: "#374151",
            cursor: "pointer",
          }}
        >
          <option value="newest">Newest first</option>
          <option value="highest">Highest rating</option>
          <option value="lowest">Lowest rating</option>
        </select>
      </div>

      {/* Reviews list */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#9CA3AF", fontSize: 14 }}>
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map((r) => (
            <ReviewCard key={r.id} review={r} onHelpful={handleHelpful} />
          ))}
        </div>
      )}

      {/* Toast */}
      <Toast visible={toast} />
    </div>
  );
}