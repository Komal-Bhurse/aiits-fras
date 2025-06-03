import express from "express";
import helmet from 'helmet';
import path from "path";

import connectDB from "./db-connection.js";

import userRoutes from "./routes/users.js"
import attendanceRoutes from "./routes/attendences.js"
import syncRoutes from "./routes/sync.js"

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// middlewares
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https: data:"]
      }
    })
  );

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.resolve("./", 'frontend', 'dist')));

app.use('/api/user', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/sync', syncRoutes);

// Frontend route
app.get("/", (req, res) => {
    res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});

app.get("/mark-attendance", (req, res) => {
    res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});

app.get("/admin/user-register", (req, res) => {
  res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});
app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});
app.get("/admin/users", (req, res) => {
  res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});
app.get("/admin/present-users", (req, res) => {
  res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});
app.get("/admin/absent-users", (req, res) => {
  res.sendFile(path.resolve("./", 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(` Server Running on port ${PORT}`);
});






