// app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth";
import emailRoutes from "./routes/email";
import flowRoutes from "./routes/flow";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/flow", flowRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;

// Only connect to MongoDB and start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 4000;

  mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => console.error("MongoDB connection error:", err));
}
