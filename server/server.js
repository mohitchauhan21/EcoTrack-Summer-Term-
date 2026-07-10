import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

// Config
import connectDB from './config/db.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

// Routes
import healthRoutes from './routes/healthRoutes.js';

// =====================================================
// Load environment variables
// =====================================================
dotenv.config();

// =====================================================
// Connect to MongoDB
// =====================================================
connectDB();

// =====================================================
// Initialize Express
// =====================================================
const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// Security Middleware
// =====================================================
app.use(helmet());

// =====================================================
// CORS Configuration
// =====================================================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// =====================================================
// Body Parsers
// =====================================================
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// =====================================================
// Cookie Parser
// =====================================================
app.use(cookieParser(process.env.COOKIE_SECRET));

// =====================================================
// HTTP Request Logger
// =====================================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// =====================================================
// Static Files (uploads)
// =====================================================
app.use('/uploads', express.static('uploads'));

// =====================================================
// API Routes
// =====================================================
app.use('/api/health', healthRoutes);

// =====================================================
// Error Handling
// =====================================================
app.use(notFound);
app.use(errorHandler);

// =====================================================
// Start Server
// =====================================================
app.listen(PORT, () => {
  console.log(`🚀 EcoTrack Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;
