import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  estimatedDuration: string;
  estimatedCost: number;
  category: 'sightseeing' | 'food' | 'nature' | 'heritage' | 'transport' | 'relaxation';
  notes?: string;
}

export interface IDayPlan {
  dayNumber: number;
  theme: string;
  dayNotes?: string;
  activities: IActivity[];
}

export interface ITrip extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  title: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  travellers: number;
  budget: number;
  currency: string;
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'fast';
  transport: string;
  summary: string;
  days: IDayPlan[];
  estimatedTotalCost: number;
  notes: string[];
  status: 'draft' | 'planned' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    id: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    estimatedDuration: { type: String, required: true },
    estimatedCost: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'nature', 'heritage', 'transport', 'relaxation'],
      default: 'sightseeing',
    },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const dayPlanSchema = new Schema<IDayPlan>(
  {
    dayNumber: { type: Number, required: true },
    theme: { type: String, required: true },
    dayNotes: { type: String, default: '' },
    activities: [activitySchema],
  },
  { _id: false }
);

const tripSchema = new Schema<ITrip>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trip must have an owner'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    durationDays: { type: Number, required: true, min: 1, max: 30 },
    travellers: { type: Number, required: true, min: 1, max: 50, default: 1 },
    budget: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    interests: [{ type: String }],
    pace: {
      type: String,
      enum: ['relaxed', 'moderate', 'fast'],
      default: 'moderate',
    },
    transport: { type: String, default: 'Mixed / Car' },
    summary: { type: String, default: '' },
    days: [dayPlanSchema],
    estimatedTotalCost: { type: Number, default: 0 },
    notes: [{ type: String }],
    status: {
      type: String,
      enum: ['draft', 'planned', 'completed'],
      default: 'planned',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

tripSchema.index({ owner: 1, createdAt: -1 });

export const Trip: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', tripSchema);
