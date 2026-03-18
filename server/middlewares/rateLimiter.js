import rateLimit from 'express-rate-limit';

// General AI operations rate limiter
export const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per 15 minutes per IP
    message: {
        success: false,
        message: 'Too many AI requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.auth?.userId || req.ip;
    }
});

// Image generation rate limiter (more restrictive)
export const imageRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: 'Too many image generation requests, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.auth?.userId || req.ip;
    }
});

// File upload rate limiter (most restrictive)
export const fileUploadRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many file uploads, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.auth?.userId || req.ip;
    }
});

// Project operations rate limiter
export const projectRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many project requests, please slow down.',
        retryAfter: '10 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.auth?.userId || req.ip;
    }
});

// User operations rate limiter
export const userRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter: '5 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.auth?.userId || req.ip;
    }
});