import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3030';
export const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('[CampusOS Client] Connected to Kernel WebSocket:', socket.id);
});