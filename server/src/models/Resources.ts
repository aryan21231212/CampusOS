import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  resourceId: string;
  name: string;
  type: string;
  totalQuantity: number;
  availableQuantity: number;
  location: string;
  status: 'Active' | 'Maintenance' | 'Disabled';
}

const ResourceSchema = new Schema<IResource>({
  resourceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  availableQuantity: { type: Number, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Maintenance', 'Disabled'], default: 'Active' }
});

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);