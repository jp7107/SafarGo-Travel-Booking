require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@safar.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists, skipping seed");
      process.exit(0);
    }

    const admin = await Admin.create({
      email: "admin@safar.com",
      password: "Admin@123",
      name: "Safar Admin",
      role: "admin",
    });

    console.log(`✅ Admin seeded successfully:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: Admin@123`);
    console.log(`   Name: ${admin.name}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
