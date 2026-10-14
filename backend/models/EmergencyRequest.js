import mongoose from 'mongoose';

const emergencyRequestSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Citizen reference is required']
    },
    category: {
      type: String,
      enum: ['Food', 'Medical', 'Shelter', 'Rescue'],
      required: [true, 'Emergency category is required']
    },
    description: {
      type: String,
      required: [true, 'Emergency description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    location: {
      type: String,
      required: [true, 'Location address or landmark is required'],
      trim: true
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    },
    peopleAffected: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 person must be affected']
    },
    contactPhone: {
      type: String,
      trim: true,
      default: ''
    },
    priority: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    priorityReason: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'],
      default: 'PENDING'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    resolutionNotes: {
      type: String,
      default: ''
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest',
      default: null
    },
    duplicateScore: {
      type: Number,
      default: 0
    },
    duplicateWarning: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for query performance
emergencyRequestSchema.index({ status: 1 });
emergencyRequestSchema.index({ priority: 1 });
emergencyRequestSchema.index({ category: 1 });
emergencyRequestSchema.index({ latitude: 1, longitude: 1 });
emergencyRequestSchema.index({ createdAt: -1 });

const EmergencyRequest = mongoose.model('EmergencyRequest', emergencyRequestSchema);
export default EmergencyRequest;
