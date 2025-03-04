const mongoose = require("mongoose");

const WatchlistSchema = new mongoose.Schema({
  type: { type: String, enum: ["movie", "book"], required: true },
  title: { type: String, required: true },
  genre: { type: String, required: true },
  status: { type: String, enum: ["pending", "watched"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
WatchlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Watchlist", WatchlistSchema);
