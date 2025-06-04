import httpStatus from "http-status";
import rateLimit from "express-rate-limit";

// Email submission rate limiter
export const emailRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  limit: 1, // limit each IP to 1 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: httpStatus.TOO_MANY_REQUESTS,
    success: false,
    message: "Too many requests from this IP, please try again after an hour",
  },
});

// Global rate limiter for all requests (optional)
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  limit: 1, // limit each IP to 1 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
});
