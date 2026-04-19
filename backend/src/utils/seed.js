require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@safar.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("❌ ADMIN_PASSWORD is not defined in .env file");
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️ Admin ${adminEmail} already exists, skipping seed`);
      process.exit(0);
    }

    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
      name: "Safar Admin",
      role: "admin",
    });

    console.log(`✅ Admin seeded successfully:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: [HIDDEN FOR SECURITY]`);
    console.log(`   Name: ${admin.name}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
