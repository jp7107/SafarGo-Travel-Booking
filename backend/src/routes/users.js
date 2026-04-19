const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
router.get("/profile", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put("/profile", auth, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    res.json({ message: "Profile updated", user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
