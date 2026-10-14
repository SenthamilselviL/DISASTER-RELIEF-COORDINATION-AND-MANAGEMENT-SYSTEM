import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    userName: {
      type: String,
      default: 'System'
    },
    userRole: {
      type: String,
      default: 'SYSTEM'
    },
    action: {
      type: String,
      required: true,
      enum: [
        'REQUEST_CREATED',
        'REQUEST_CLAIMED',
        'STATUS_UPDATED',
        'REQUEST_RESOLVED',
        'DUPLICATE_FLAGGED',
        'RESOURCE_CREATED',
        'RESOURCE_ALLOCATED',
        'USER_ROLE_CHANGED',
        'USER_STATUS_CHANGED'
      ]
    },
    details: {
      type: String,
      required: true
    },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest',
      default: null
    },
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
