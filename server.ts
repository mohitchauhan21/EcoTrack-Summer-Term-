import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Routes
import authRoutes from "./server/routes/authRoutes.js";
import companyRoutes from "./server/routes/companyRoutes.js";
import departmentRoutes from "./server/routes/departmentRoutes.js";
import logRoutes from "./server/routes/logRoutes.js";
import analyticsRoutes from "./server/routes/analyticsRoutes.js";
import userRoutes from "./server/routes/userRoutes.js";
import { seedData } from "./server/scripts/seedMockData.js";

async function connectDb() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB via MONGO_URI");
  } else {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB at ${uri}`);
    await seedData();
  }
}

async function startServer() {
  await connectDb();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/company", companyRoutes);
  app.use("/api/departments", departmentRoutes);
  app.use("/api/logs", logRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/users", userRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
