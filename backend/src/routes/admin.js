const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Trip = require("../models/Trip");
const Booking = require("../models/Booking");
const adminAuth = require("../middleware/admin");
const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin
router.get("/me", adminAuth, (req, res) => {
  res.json({ admin: req.admin });
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats
router.get("/dashboard", adminAuth, async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, totalBookings, pendingTrips, approvedTrips, rejectedTrips] =
      await Promise.all([
        User.countDocuments(),
        Trip.countDocuments(),
        Booking.countDocuments(),
        Trip.countDocuments({ status: "pending" }),
        Trip.countDocuments({ status: "approved" }),
        Trip.countDocuments({ status: "rejected" }),
      ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email avatar createdAt");

    const recentTrips = await Trip.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name place status createdAt");

    res.json({
      stats: {
        totalUsers,
        totalTrips,
        totalBookings,
        pendingTrips,
        approvedTrips,
        rejectedTrips,
      },
      recentUsers,
      recentTrips,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with search/filter
router.get("/users", adminAuth, async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-__v");

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/trips
// @desc    Get all trips with search/filter
router.get("/trips", adminAuth, async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { place: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const trips = await Trip.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "name email avatar");

    const total = await Trip.countDocuments(query);

    res.json({
      trips,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/trips/:id/status
// @desc    Update trip status (approve/reject)
router.put("/trips/:id/status", adminAuth, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email avatar");

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json({ message: `Trip ${status}`, trip });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings
router.get("/bookings", adminAuth, async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.destination = { $regex: search, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("userId", "name email avatar")
      .populate("tripId", "place days budget");

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/users/:id/toggle
// @desc    Toggle user active status
router.put("/users/:id/toggle", adminAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
