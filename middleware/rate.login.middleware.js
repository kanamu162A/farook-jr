import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 3, 
  message: {
    status: "fail",
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});
