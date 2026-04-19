const express = require("express");
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");
const { sendTripEmail } = require("../utils/email");
const router = express.Router();

// @route   POST /api/trips
// @desc    Submit a new trip request
router.post("/", async (req, res, next) => {
  try {
    const { name, email, place, days, budget, people, notes } = req.body;

    if (!name || !email || !place || !days || !budget) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const tripData = {
      name,
      email,
      place,
      days: Number(days),
      budget: Number(budget),
      people: Number(people) || 1,
      notes: notes || "",
    };

    // If user is authenticated, link the trip
    if (req.headers.authorization) {
      try {
        const jwt = require("jsonwebtoken");
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        tripData.userId = decoded.id;
      } catch (e) {
        // Not authenticated, continue without userId
      }
    }

    const trip = await Trip.create(tripData);

    // Send confirmation email (non-blocking)
    sendTripEmail(email, tripData).catch(console.error);

    res.status(201).json({
      message: "Trip request submitted successfully!",
      trip,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/trips
// @desc    Get all trips (authenticated)
router.get("/", auth, async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar");

    res.json({ trips });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/trips/:id
// @desc    Get trip by ID
router.get("/:id", async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("userId", "name email avatar");

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json({ trip });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
