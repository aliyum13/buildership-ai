import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';

const app = express()

// ============================================
// CLOUDINARY CONNECTION
// ============================================
try {
    await connectCloudinary()
    console.log('✅ Cloudinary connected successfully');
} catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    process.exit(1);
}

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// CORS Configuration - MUST be before other middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
}))

// Handle preflight requests
app.options('*', cors())

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Clerk authentication middleware
app.use(clerkMiddleware())

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'BuilderShip AI Server is Live!',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
})

// API health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

// ============================================
// PROTECTED ROUTES (Authentication Required)
// ============================================

// Apply auth to all routes below this point
app.use(requireAuth())

// Mount API routes
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)
app.use('/api/projects', projectRouter)

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route not found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method
    })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);

    // Handle Clerk authentication errors
    if (err.status === 401 || err.message?.includes('Unauthenticated')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please sign in.',
            error: process.env.NODE_ENV === 'production' ? undefined : err.message
        })
    }

    // Handle file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            message: 'File size too large. Maximum size is 10MB.',
            maxSize: '10MB'
        })
    }

    // Handle multer errors
    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        })
    }

    // Handle rate limit errors
    if (err.status === 429) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfter: err.retryAfter || '15 minutes'
        })
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: err.errors
        })
    }

    // Handle CORS errors
    if (err.message?.includes('CORS')) {
        return res.status(403).json({
            success: false,
            message: 'CORS policy violation',
            error: process.env.NODE_ENV === 'production' ? undefined : err.message
        })
    }

    // Default error response
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV !== 'production' && { 
            stack: err.stack,
            type: err.name 
        })
    })
})

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
    console.log('\n================================');
    console.log('🚀 BuilderShip AI Server Started');
    console.log('================================');
    console.log(`📡 Port:        ${PORT}`);
    console.log(`🌍 Environment: ${ENV}`);
    console.log(`⏰ Started at:  ${new Date().toLocaleString()}`);
    console.log('================================\n');
    
    if (ENV === 'development') {
        console.log('🔗 Frontend URLs:');
        console.log('   - http://localhost:5173');
        console.log('   - http://localhost:5174');
        console.log('\n📚 API Endpoints:');
        console.log('   - Health:  GET  /api/health');
        console.log('   - AI:      POST /api/ai/*');
        console.log('   - User:    GET  /api/user/*');
        console.log('   - Projects: *   /api/projects/*');
        console.log('\n');
    }
})

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

// Handle SIGTERM (e.g., from hosting platforms)
process.on('SIGTERM', () => {
    console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', reason);
    console.error('Promise:', promise);
    
    // In production, you might want to log to a service and exit
    if (process.env.NODE_ENV === 'production') {
        console.log('Exiting due to unhandled rejection...');
        process.exit(1);
    }
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    
    // In production, exit immediately as the app is in an undefined state
    if (process.env.NODE_ENV === 'production') {
        console.log('Exiting due to uncaught exception...');
        process.exit(1);
    }
})

export default app;