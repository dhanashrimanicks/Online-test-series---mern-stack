const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const studentRoutes = require("./routes/studentRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const facultyRoutes = require("./routes/facultyRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const testRoutes = require("./routes/testRoutes.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const cors = require("cors");
const path = require("path");

// Load env
//dotenv.config(); // or use
dotenv.config({ path: "./config.env" });

const app = express();

// Connect Database
connectDB();
app.use(cookieParser());

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
// const testRoutes = require("./routes/testRoutes");
// app.use("/api", testRoutes);


// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
