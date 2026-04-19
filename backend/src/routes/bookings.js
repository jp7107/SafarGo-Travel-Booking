const express = require("express");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
router.post("/", auth, async (req, res, next) => {
  try {
    const { destination, startDate, endDate, travelers, totalBudget, tripId } = req.body;

    if (!destination || !startDate || !endDate || !totalBudget) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      tripId: tripId || null,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers: Number(travelers) || 1,
      totalBudget: Number(totalBudget),
    });

    res.status(201).json({
      message: "Booking created successfully!",
      booking,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
router.get("/my", auth, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("tripId", "place days budget status");

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
