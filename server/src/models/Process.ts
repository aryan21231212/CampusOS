import mongoose, { Schema, Document } from 'mongoose';

export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'BLOCKED' | 'TERMINATED';

export interface IProcess extends Document {
  processId: string;
  userId: mongoose.Types.ObjectId;
  resourceId: string;
  quantity: number;
  arrivalTime: number;
  burstTime: number;
  deadline: number;
  priority: number;
  currentState: ProcessState;
  maxRequirement: number;
  allocatedResources: number;
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
  createdAt: Date;
}

const ProcessSchema = new Schema<IProcess>({
  processId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: String, required: true },
  quantity: { type: Number, required: true },
  arrivalTime: { type: Number, required: true, default: 0 },
  burstTime: { type: Number, required: true, default: 5 },
  deadline: { type: Number, required: true, default: 100 },
  priority: { type: Number, required: true, default: 1 },
  currentState: { 
    type: String, 
    enum: ['NEW', 'READY', 'RUNNING', 'WAITING', 'BLOCKED', 'TERMINATED'], 
    default: 'NEW' 
  },
  maxRequirement: { type: Number, required: true, default: 1 },
  allocatedResources: { type: Number, default: 0 },
  waitingTime: { type: Number, default: 0 },
  turnaroundTime: { type: Number, default: 0 },
  completionTime: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Process = mongoose.model<IProcess>('Process', ProcessSchema);