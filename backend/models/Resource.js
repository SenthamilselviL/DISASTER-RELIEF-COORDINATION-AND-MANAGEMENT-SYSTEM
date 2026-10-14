import mongoose from 'mongoose';

const allocationRecordSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmergencyRequest',
    required: true
  },
  allocatedQuantity: {
    type: Number,
    required: true,
    min: [1, 'Must allocate at least 1 unit']
  },
  allocatedAt: {
    type: Date,
    default: Date.now
  },
  allocatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    default: ''
  }
});

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Food Kits', 'Medical Supplies', 'Shelter Units', 'Rescue Teams', 'Water & Sanitation', 'Other'],
      required: [true, 'Resource type is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    availableQuantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Available quantity cannot be negative']
    },
    location: {
      type: String,
      required: [true, 'Warehouse or depot location is required'],
      trim: true
    },
    allocatedTo: [allocationRecordSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

resourceSchema.index({ type: 1 });
resourceSchema.index({ availableQuantity: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
