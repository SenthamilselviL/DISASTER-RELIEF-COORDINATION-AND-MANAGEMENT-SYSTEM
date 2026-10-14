import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development server
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const connected = isDbConnected();
  res.json({
    status: 'ONLINE',
    service: 'Disaster Relief Coordination API',
    timestamp: new Date().toISOString(),
    isDatabaseConnected: connected,
    database: 'MongoDB Atlas',
    storageMode: connected ? 'MongoDB Atlas (Persistent)' : 'Disconnected (Awaiting Atlas Connection)'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity', activityRoutes);

// Catch-all 404 for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' does not exist`
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server & Connect Database
const startServer = async () => {
  try {
    // Attempt DB connection in background without blocking server bind
    connectDB();

    app.listen(PORT, () => {
      console.log('\x1b[32m%s\x1b[0m', `========================================================`);
      console.log('\x1b[32m%s\x1b[0m', ` DISASTER RELIEF SYSTEM BACKEND RUNNING ON PORT ${PORT}`);
      console.log('\x1b[32m%s\x1b[0m', ` API Base URL: http://localhost:${PORT}/api`);
      console.log('\x1b[32m%s\x1b[0m', ` Health Check: http://localhost:${PORT}/api/health`);
      console.log('\x1b[32m%s\x1b[0m', `========================================================\n`);
    });
  } catch (err) {
    console.error('[Server] Startup error:', err);
    process.exit(1);
  }
};

startServer();
