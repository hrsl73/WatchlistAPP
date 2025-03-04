const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Debugging Middleware (Logs incoming requests)
app.use((req, res, next) => {
  console.log(`📢 ${req.method} Request to: ${req.url}`);
  if (Object.keys(req.body).length) {
    console.log("📦 Request Body:", req.body);
  }
  next();
});

// Routes
const watchlistRoutes = require("./routes/watchlistRoutes");
app.use("/api/watchlist", watchlistRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
