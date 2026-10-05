import rateLimit from "express-rate-limit";

// General API rate limiter
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    standardHeaders: true, // Return standard `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    }
});

// Stricter rate limiter for authentication routes (login / register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // 20 attempts per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again after 15 minutes."
    }
});

// Rate limiter for expensive AI endpoints
export const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // 30 AI generations/parses per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many AI processing requests, please try again shortly."
    }
});
