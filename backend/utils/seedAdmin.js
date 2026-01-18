import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "System Admin";

    if (!adminEmail || !adminPassword) {
      console.log(
        "Admin email or password not provided in environment. Skipping admin seeding.",
      );
      return;
    }

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      console.log("Creating initial admin user...");
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`Admin user ${adminEmail} created successfully.`);
    } else {
      console.log("Admin user already exists. Skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  }
};

export default seedAdmin;
