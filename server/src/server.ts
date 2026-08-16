import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import resourceRoutes from './routes/resourceRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api/resources', resourceRoutes);

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