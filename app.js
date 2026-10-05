import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import jdRoutes from "./src/routes/jd.routes.js";
import resumeRoutes from "./src/routes/resume.routes.js";
import { globalLimiter } from "./src/middlewares/rateLimit.middleware.js";

dotenv.config();

const app = express();

// TRUST PROXY (required for rate limiting behind reverse proxies such as Render, Vercel, Nginx)
app.set("trust proxy", 1);

// MIDDLEWARES
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive in dev, or specify strict origins
    },
    credentials: true
}));

// Apply global rate limiter to all API endpoints
app.use("/api", globalLimiter);

// MOUNT ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jd", jdRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/api/wakeup", async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Backend up and running"
    });
});

// 404 CATCH-ALL ROUTE
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found`
    });
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error("Unhandled Global Error:", err);
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

export default app;