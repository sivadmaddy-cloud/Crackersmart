
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Groq = require("groq-sdk").default;


dotenv.config();

// ─── Routes ───────────────────────────────────────────
const adminRoutes    = require("./routes/adminRoutes");
const authRoutes     = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const crackerRoutes  = require("./routes/crackerRoutes");
const orderRoutes    = require("./routes/orderRoutes");

const app = express();

// ─── Core Middleware ───────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));


  // Groq -------------------

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ API key");
    }

    console.log("📩 User message:", message);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "Invalid response from AI",
      });
    }

    console.log("📤 AI reply:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("❌ GROQ ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch AI response",
    });
  }
});

// ─── Stripe ───────────────────────────────────────────
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ─── Stripe: Create Order Session ─────────────────────
app.post("/api/create-order", async (req, res) => {
  const { cart, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      mode: "payment",
      line_items: cart.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.qty,
      })),
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/cart`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Stripe error" });
  }
});

// ─── Stripe: Get Order by Session ─────────────────────
app.get("/api/order/:session_id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.session_id,
      { expand: ["line_items"] }
    );
    const items = session.line_items.data.map((item) => ({
      name:  item.description,
      qty:   item.quantity,
      price: item.amount_total / 100,
    }));
    res.json({ items, amount: session.amount_total / 100 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// ─── Stripe: Subscription ─────────────────────────────
app.post("/api/create-subscription", async (req, res) => {
  const { email, plan } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  try {
    const amount   = plan === "yearly" ? 99900 : 9900;
    const planName = plan === "yearly" ? "Yearly Subscription" : "Monthly Subscription";
    const session  = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      mode: "payment",
      line_items: [{ price_data: { currency: "inr", product_data: { name: planName }, unit_amount: amount }, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?type=subscription`,
      cancel_url:  `${process.env.CLIENT_URL}/subscribe`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Subscription failed" });
  }
});

// ─── App Routes ───────────────────────────────────────
app.use("/admin",     adminRoutes);
app.use("/auth",      authRoutes);
app.use("/customer",  customerRoutes);
app.use("/crackers",  crackerRoutes);
app.use("/api",       orderRoutes);   // → /api/place-order, /api/my-orders, /api/all-orders

app.get("/", (req, res) => res.send("Backend Running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));