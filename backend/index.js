import dotenv from "dotenv";
import connectDB from "./config/db.js";
import seedAdmin from "./utils/seedAdmin.js";
import app from "./app.js";

dotenv.config();

// Connect to Database
const startServer = async () => {
  await connectDB();
  await seedAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    ),
  );
};

startServer();
