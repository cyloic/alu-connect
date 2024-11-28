import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import fs from "fs";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// MongoDB connection function
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

app.use(express.json());
app.use(cookieParser());

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Handle SPA routes
app.get("*", (req, res) => {
  const filePath = path.join(__dirname, "frontend", "dist", "index.html");
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    res.status(404).send("Frontend not found. Please ensure the frontend is built.");
    return;
  }
  res.sendFile(filePath);
});

// Start the server
server.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
