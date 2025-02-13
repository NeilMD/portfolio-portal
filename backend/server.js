const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/authentication");
const blogRoutes = require("./routes/blog");
const contactRoutes = require("./routes/contact");
const projectRoutes = require("./routes/project");

dotenv.config();
// TODO
// connectDB();

const app = express();

app.use(express.json());

//ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/project", projectRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
