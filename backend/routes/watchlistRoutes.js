const express = require("express");
const Watchlist = require("../models/Watchlist");

const router = express.Router();

// Add item
router.post("/", async (req, res) => {
  try {
    console.log("📥 Received item data:", JSON.stringify(req.body, null, 2));
    const newItem = new Watchlist(req.body);
    console.log("📝 Created new item:", JSON.stringify(newItem, null, 2));
    await newItem.save();
    console.log("✅ Saved item:", JSON.stringify(newItem, null, 2));
    res.json(newItem);
  } catch (err) {
    console.error("❌ Error adding item:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get items by type (movies or books)
router.get("/:type", async (req, res) => {
  try {
    const type = req.params.type;
    console.log("🔍 Fetching items of type:", type);
    const items = await Watchlist.find({ type: type }).sort({ createdAt: -1 });
    console.log("📤 Sending items:", JSON.stringify(items, null, 2));
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Watchlist.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔄 Updating item with ID:", id);
    console.log("📥 Update data:", JSON.stringify(req.body, null, 2));

    if (!id) {
      return res.status(400).json({ error: "Missing ID parameter" });
    }

    const updatedItem = await Watchlist.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    console.log("✅ Updated item:", JSON.stringify(updatedItem, null, 2));
    res.json(updatedItem);
  } catch (err) {
    console.error("❌ Error updating item:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting item with ID:", id);

    if (!id || id === "undefined") {
      return res.status(400).json({ error: "Invalid ID parameter" });
    }

    const deletedItem = await Watchlist.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item deleted", deletedItem });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
