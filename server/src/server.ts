import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import resourceRoutes from './routes/resourceRoutes';
import schedulerRoutes from './routes/schedulerRoutes';
import requestRoutes from './routes/requestRoutes';
import kernelRoutes from './routes/kernelRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// ==========================================
// 1. ESSENTIAL MIDDLEWARE (Must be before routes)
// ==========================================
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// ==========================================
// 2. API ROUTES
// ==========================================
app.use('/api/resources', resourceRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/kernel', kernelRoutes);

// Base Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    system: 'CAMPUSOS Kernel',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// WebSocket Connection Handler
io.on('connection', (socket) => {
  console.log(`[Kernel] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Kernel] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3030;

server.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`   CAMPUSOS KERNEL ACTIVE ON PORT ${PORT} `);
  console.log(`========================================`);
});

export { io };