import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import Resource from '../models/Resource.js';
import ActivityLog from '../models/ActivityLog.js';
import { isDbConnected } from '../config/db.js';
import { calculateDistanceMeters } from '../utils/distance.js';

// In-Memory store state for zero-config fallback
let memoryUsers = [];
let memoryRequests = [];
let memoryResources = [];
let memoryLogs = [];

const DEFAULT_HASHED_PASS = bcrypt.hashSync('Password123!', 10);

export const initMemoryData = () => {
  const citizenId = '654321000000000000000001';
  const ngoId = '654321000000000000000002';
  const volunteerId = '654321000000000000000003';
  const govId = '654321000000000000000004';
  const adminId = '654321000000000000000005';

  memoryUsers = [
    {
      _id: citizenId,
      name: 'Karthik Raman (Citizen)',
      email: 'citizen@example.com',
      phone: '+91 98401 23456',
      password: DEFAULT_HASHED_PASS,
      role: 'CITIZEN',
      organization: '',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: ngoId,
      name: 'Relief India Foundation',
      email: 'ngo@example.com',
      phone: '+91 98402 34567',
      password: DEFAULT_HASHED_PASS,
      role: 'NGO',
      organization: 'Relief India Foundation NGO',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: volunteerId,
      name: 'Arun Kumar (Disaster Volunteer)',
      email: 'volunteer@example.com',
      phone: '+91 98403 45678',
      password: DEFAULT_HASHED_PASS,
      role: 'VOLUNTEER',
      organization: 'Tamil Nadu Youth Relief Force',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: govId,
      name: 'Disaster Management Authority',
      email: 'government@example.com',
      phone: '+91 98404 56789',
      password: DEFAULT_HASHED_PASS,
      role: 'GOVERNMENT',
      organization: 'State Disaster Management Control Room',
      isActive: true,
      createdAt: new Date()
    },
    {
      _id: adminId,
      name: 'System Administrator',
      email: 'admin@example.com',
      phone: '+91 98405 67890',
      password: DEFAULT_HASHED_PASS,
      role: 'ADMIN',
      organization: 'Central Incident Management Unit',
      isActive: true,
      createdAt: new Date()
    }
  ];

  memoryResources = [
    {
      _id: '654321000000000000000101',
      name: 'Emergency Dry Ration & Food Packets',
      type: 'Food Kits',
      quantity: 2500,
      availableQuantity: 2150,
      location: 'Central Civil Supplies Warehouse, Koyambedu, Chennai',
      allocatedTo: [],
      createdBy: { _id: govId, name: 'Disaster Management Authority', role: 'GOVERNMENT' },
      createdAt: new Date()
    },
    {
      _id: '654321000000000000000102',
      name: 'Mobile Trauma Care & Essential Drug Kits',
      type: 'Medical Supplies',
      quantity: 500,
      availableQuantity: 420,
      location: 'Rajiv Gandhi Government General Hospital Depot, Chennai',
      allocatedTo: [],
      createdBy: { _id: govId, name: 'Disaster Management Authority', role: 'GOVERNMENT' },
      createdAt: new Date()
    },
    {
      _id: '654321000000000000000103',
      name: 'Inflatable Rescue Boats & Life Jackets',
      type: 'Rescue Teams',
      quantity: 50,
      availableQuantity: 38,
      location: 'Saidapet Fire & Rescue Central Station, Chennai',
      allocatedTo: [],
      createdBy: { _id: govId, name: 'Disaster Management Authority', role: 'GOVERNMENT' },
      createdAt: new Date()
    },
    {
      _id: '654321000000000000000104',
      name: 'Waterproof Relief Tents & Tarpaulin Units',
      type: 'Shelter Units',
      quantity: 400,
      availableQuantity: 320,
      location: 'Tambaram Emergency Shelter Stockpile, Chennai',
      allocatedTo: [],
      createdBy: { _id: govId, name: 'Disaster Management Authority', role: 'GOVERNMENT' },
      createdAt: new Date()
    },
    {
      _id: '654321000000000000000105',
      name: 'Clean Drinking Water Cans (20 Litre)',
      type: 'Food Kits',
      quantity: 5000,
      availableQuantity: 4100,
      location: 'Kilpauk Water Works Storage, Chennai',
      allocatedTo: [],
      createdBy: { _id: govId, name: 'Disaster Management Authority', role: 'GOVERNMENT' },
      createdAt: new Date()
    }
  ];

  const primaryVelacheryId = '654321000000000000000201';

  memoryRequests = [
    {
      _id: primaryVelacheryId,
      citizen: memoryUsers[0],
      category: 'Rescue',
      description: 'Water rising rapidly above 5 feet inside ground floor houses. Elderly residents and 2 children stranded on rooftop. Immediate boat evacuation urgently needed!',
      location: 'Bhuvaneshwari Nagar, Velachery, Chennai',
      latitude: 12.9815,
      longitude: 80.2180,
      peopleAffected: 6,
      contactPhone: '+91 98401 23456',
      priority: 'CRITICAL',
      priorityReason: 'Immediate physical peril, trapped victims, or life-threatening environmental hazard',
      status: 'PENDING',
      assignedTo: null,
      assignedAt: null,
      resolvedAt: null,
      duplicateOf: null,
      duplicateScore: 0,
      duplicateWarning: '',
      createdAt: new Date(Date.now() - 3600000 * 3)
    },
    {
      _id: '654321000000000000000202',
      citizen: memoryUsers[0],
      category: 'Medical',
      description: 'Elderly diabetic heart patient has lost oxygen cylinder support due to power cut and chest pain developing. Immediate medical paramedic required.',
      location: 'Gandhi Nagar 2nd Main Rd, Adyar, Chennai',
      latitude: 13.0012,
      longitude: 80.2565,
      peopleAffected: 2,
      contactPhone: '+91 94441 55667',
      priority: 'CRITICAL',
      priorityReason: 'Life-threatening medical condition, severe trauma, or multiple casualties indicated',
      status: 'ASSIGNED',
      assignedTo: memoryUsers[1],
      assignedAt: new Date(Date.now() - 3600000 * 2),
      resolvedAt: null,
      duplicateOf: null,
      duplicateScore: 0,
      duplicateWarning: '',
      createdAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      _id: '654321000000000000000203',
      citizen: memoryUsers[0],
      category: 'Food',
      description: 'About 35 displaced daily wage families camped at community hall without drinking water and rations for last 36 hours.',
      location: 'Near Old Bus Stand, Tambaram West, Chennai',
      latitude: 12.9249,
      longitude: 80.1000,
      peopleAffected: 35,
      contactPhone: '+91 98840 99881',
      priority: 'HIGH',
      priorityReason: 'Critical food exhaustion or large group facing acute shortage',
      status: 'IN_PROGRESS',
      assignedTo: memoryUsers[2],
      assignedAt: new Date(Date.now() - 3600000 * 4),
      resolvedAt: null,
      duplicateOf: null,
      duplicateScore: 0,
      duplicateWarning: '',
      createdAt: new Date(Date.now() - 3600000 * 6)
    },
    {
      _id: '654321000000000000000204',
      citizen: memoryUsers[0],
      category: 'Shelter',
      description: 'Sheet roofs blown away by heavy wind gusts. 12 people including 3 infants currently exposed in pouring rain.',
      location: 'Ram Nagar South Extension, Madipakkam, Chennai',
      latitude: 12.9647,
      longitude: 80.1961,
      peopleAffected: 12,
      contactPhone: '+91 97910 11223',
      priority: 'HIGH',
      priorityReason: 'Urgent shelter requirement for vulnerable demographics or large group without roof',
      status: 'PENDING',
      assignedTo: null,
      assignedAt: null,
      resolvedAt: null,
      duplicateOf: null,
      duplicateScore: 0,
      duplicateWarning: '',
      createdAt: new Date(Date.now() - 3600000 * 7)
    },
    {
      _id: '654321000000000000000205',
      citizen: memoryUsers[0],
      category: 'Food',
      description: 'Drinking water contamination reported in our street. 8 families need 20L clean water cans and dry biscuits.',
      location: 'Jones Road, Saidapet, Chennai',
      latitude: 13.0213,
      longitude: 80.2231,
      peopleAffected: 18,
      contactPhone: '+91 91760 33445',
      priority: 'HIGH',
      priorityReason: 'Food and potable water required for family with infants or elderly',
      status: 'RESOLVED',
      assignedTo: memoryUsers[1],
      assignedAt: new Date(Date.now() - 3600000 * 8),
      resolvedAt: new Date(Date.now() - 3600000 * 1),
      resolutionNotes: 'Delivered 25 water cans and 20 relief ration boxes via NDRF tractor.',
      duplicateOf: null,
      duplicateScore: 0,
      duplicateWarning: '',
      createdAt: new Date(Date.now() - 3600000 * 9)
    },
    {
      _id: '654321000000000000000206',
      citizen: memoryUsers[0],
      category: 'Medical',
      description: 'Minor fever and need baby formula milk for 6-month-old infant. Family safe on first floor.',
      location: 'Paper Mills Road, Perambur, Chennai',
      latitude: 13.1118,
      longitude: 80.2435,
      peopleAffected: 3,
      contactPhone: '+91 93810 66778',
      priority: 'HIGH',
      priorityReason: 'Medical assistance urgently needed for vulnerable individuals or small group',
      status: 'PENDING',
      assignedTo: null,
      assignedAt: null,
      resolvedAt: null,
      duplicateOf: null,
      duplicateScore: 0,
      duplicateWarning: '',
      createdAt: new Date(Date.now() - 3600000 * 4)
    },
    {
      _id: '654321000000000000000207',
      citizen: memoryUsers[0],
      category: 'Rescue',
      description: 'Water rising in houses on Bhuvaneshwari Nagar 3rd street. Trapped families on roof need boat rescue!',
      location: '3rd Cross St, Bhuvaneshwari Nagar, Velachery, Chennai',
      latitude: 12.9822,
      longitude: 80.2185,
      peopleAffected: 4,
      contactPhone: '+91 98401 99999',
      priority: 'CRITICAL',
      priorityReason: 'Immediate physical peril, trapped victims, or life-threatening environmental hazard',
      status: 'PENDING',
      assignedTo: null,
      assignedAt: null,
      resolvedAt: null,
      duplicateOf: {
        _id: primaryVelacheryId,
        category: 'Rescue',
        location: 'Bhuvaneshwari Nagar, Velachery, Chennai',
        status: 'PENDING',
        priority: 'CRITICAL'
      },
      duplicateScore: 92,
      duplicateWarning: `Possible duplicate of request #${primaryVelacheryId.slice(-6)} (Rescue at Bhuvaneshwari Nagar, Velachery, 95 m away, status: PENDING)`,
      createdAt: new Date(Date.now() - 3600000 * 2)
    }
  ];

  memoryLogs = [
    {
      _id: '654321000000000000000301',
      user: memoryUsers[3],
      userName: 'Disaster Management Authority',
      userRole: 'GOVERNMENT',
      action: 'RESOURCE_CREATED',
      details: 'Initial emergency relief supplies allocated from State Central Reserve',
      createdAt: new Date(Date.now() - 3600000 * 12)
    },
    {
      _id: '654321000000000000000302',
      user: memoryUsers[0],
      userName: 'Karthik Raman (Citizen)',
      userRole: 'CITIZEN',
      action: 'REQUEST_CREATED',
      details: 'Emergency Rescue request submitted for Velachery, Chennai',
      request: memoryRequests[0],
      createdAt: new Date(Date.now() - 3600000 * 3)
    },
    {
      _id: '654321000000000000000303',
      user: memoryUsers[0],
      userName: 'Karthik Raman (Citizen)',
      userRole: 'CITIZEN',
      action: 'DUPLICATE_FLAGGED',
      details: memoryRequests[6].duplicateWarning,
      request: memoryRequests[6],
      createdAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      _id: '654321000000000000000304',
      user: memoryUsers[1],
      userName: 'Relief India Foundation',
      userRole: 'NGO',
      action: 'REQUEST_CLAIMED',
      details: 'Relief India Foundation claimed Medical emergency in Adyar',
      request: memoryRequests[1],
      createdAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      _id: '654321000000000000000305',
      user: memoryUsers[2],
      userName: 'Arun Kumar (Disaster Volunteer)',
      userRole: 'VOLUNTEER',
      action: 'STATUS_UPDATED',
      details: 'Volunteer updated Tambaram food request status to IN_PROGRESS',
      request: memoryRequests[2],
      createdAt: new Date(Date.now() - 3600000 * 4)
    },
    {
      _id: '654321000000000000000306',
      user: memoryUsers[1],
      userName: 'Relief India Foundation',
      userRole: 'NGO',
      action: 'REQUEST_RESOLVED',
      details: 'Saidapet drinking water request successfully resolved',
      request: memoryRequests[4],
      createdAt: new Date(Date.now() - 3600000 * 1)
    }
  ];
};

initMemoryData();

export const Storage = {
  // USER METHODS
  async findUserByEmail(email, includePassword = false) {
    if (isDbConnected()) {
      const q = User.findOne({ email: email.toLowerCase() });
      if (includePassword) q.select('+password');
      return await q;
    }
    const found = memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return null;
    return {
      ...found,
      async comparePassword(pwd) {
        return await bcrypt.compare(pwd, found.password);
      }
    };
  },

  async findUserById(id) {
    if (isDbConnected()) {
      return await User.findById(id);
    }
    const found = memoryUsers.find(u => u._id.toString() === id.toString());
    return found || null;
  },

  async createUser(userData) {
    if (isDbConnected()) {
      return await User.create(userData);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...userData,
      password: hashedPassword,
      isActive: true,
      createdAt: new Date()
    };
    memoryUsers.unshift(newUser);
    return newUser;
  },

  async getAllUsers(filter = {}) {
    if (isDbConnected()) {
      return await User.find(filter).select('-password').sort({ createdAt: -1 });
    }
    let list = [...memoryUsers];
    if (filter.role && filter.role !== 'ALL') {
      list = list.filter(u => u.role === filter.role);
    }
    if (filter.status === 'active') list = list.filter(u => u.isActive);
    if (filter.status === 'inactive') list = list.filter(u => !u.isActive);
    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
    }
    return list.map(({ password, ...rest }) => rest);
  },

  async updateUserRole(userId, newRole) {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) return null;
      user.role = newRole;
      await user.save();
      return user;
    }
    const user = memoryUsers.find(u => u._id.toString() === userId.toString());
    if (!user) return null;
    user.role = newRole;
    return user;
  },

  async toggleUserStatus(userId) {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) return null;
      user.isActive = !user.isActive;
      await user.save();
      return user;
    }
    const user = memoryUsers.find(u => u._id.toString() === userId.toString());
    if (!user) return null;
    user.isActive = !user.isActive;
    return user;
  },

  // REQUEST METHODS
  async createRequest(reqData) {
    if (isDbConnected()) {
      return await EmergencyRequest.create(reqData);
    }
    const citizen = memoryUsers.find(u => u._id.toString() === reqData.citizen.toString()) || {
      _id: reqData.citizen,
      name: 'Citizen',
      phone: reqData.contactPhone
    };
    const newReq = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...reqData,
      citizen,
      status: 'PENDING',
      assignedTo: null,
      assignedAt: null,
      resolvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryRequests.unshift(newReq);
    return newReq;
  },

  async getRecentActiveRequests() {
    if (isDbConnected()) {
      const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
      return await EmergencyRequest.find({
        status: { $in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] },
        createdAt: { $gte: threeDaysAgo }
      }).lean();
    }
    return memoryRequests.filter(r => ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(r.status));
  },

  async getRequests(filters = {}) {
    if (isDbConnected()) {
      const query = {};
      if (filters.citizen) query.citizen = filters.citizen;
      if (filters.assignedTo) query.assignedTo = filters.assignedTo;
      if (filters.category && filters.category !== 'ALL') query.category = filters.category;
      if (filters.priority && filters.priority !== 'ALL') query.priority = filters.priority;
      if (filters.status && filters.status !== 'ALL') query.status = filters.status;
      if (filters.isDuplicate) query.duplicateOf = { $ne: null };
      if (filters.search) {
        query.$or = [
          { location: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } }
        ];
      }
      return await EmergencyRequest.find(query)
        .populate('citizen', 'name email phone')
        .populate('assignedTo', 'name email phone role organization')
        .populate('duplicateOf', 'category location status priority createdAt')
        .sort({ createdAt: -1 });
    }

    let list = [...memoryRequests];
    if (filters.citizen) {
      list = list.filter(r => (r.citizen?._id || r.citizen).toString() === filters.citizen.toString());
    }
    if (filters.assignedTo) {
      list = list.filter(r => (r.assignedTo?._id || r.assignedTo)?.toString() === filters.assignedTo.toString());
    }
    if (filters.category && filters.category !== 'ALL') {
      list = list.filter(r => r.category === filters.category);
    }
    if (filters.priority && filters.priority !== 'ALL') {
      list = list.filter(r => r.priority === filters.priority);
    }
    if (filters.status && filters.status !== 'ALL') {
      list = list.filter(r => r.status === filters.status);
    }
    if (filters.isDuplicate) {
      list = list.filter(r => r.duplicateOf !== null && r.duplicateOf !== undefined);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(r => (r.location && r.location.toLowerCase().includes(s)) || (r.description && r.description.toLowerCase().includes(s)));
    }
    return list;
  },

  async getRequestById(id) {
    if (isDbConnected()) {
      return await EmergencyRequest.findById(id)
        .populate('citizen', 'name email phone')
        .populate('assignedTo', 'name email phone role organization')
        .populate('duplicateOf', 'category description location status priority createdAt');
    }
    return memoryRequests.find(r => r._id.toString() === id.toString()) || null;
  },

  async claimRequest(requestId, user) {
    if (isDbConnected()) {
      return await EmergencyRequest.findOneAndUpdate(
        { _id: requestId, status: 'PENDING', assignedTo: null },
        { $set: { status: 'ASSIGNED', assignedTo: user._id, assignedAt: new Date() } },
        { new: true }
      )
        .populate('citizen', 'name email phone')
        .populate('assignedTo', 'name email phone role organization');
    }

    const req = memoryRequests.find(r => r._id.toString() === requestId.toString());
    if (!req) return { error: 'NOT_FOUND' };
    if (req.status !== 'PENDING' || req.assignedTo) {
      return { error: 'ALREADY_CLAIMED', current: req };
    }
    req.status = 'ASSIGNED';
    req.assignedTo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      organization: user.organization
    };
    req.assignedAt = new Date();
    return req;
  },

  async updateRequestStatus(requestId, status, resolutionNotes, user) {
    if (isDbConnected()) {
      const request = await EmergencyRequest.findById(requestId);
      if (!request) return null;
      request.status = status;
      if (status === 'RESOLVED') {
        request.resolvedAt = new Date();
        if (resolutionNotes) request.resolutionNotes = resolutionNotes;
      }
      await request.save();
      await request.populate('citizen', 'name email phone');
      await request.populate('assignedTo', 'name email phone role organization');
      return request;
    }

    const req = memoryRequests.find(r => r._id.toString() === requestId.toString());
    if (!req) return null;
    req.status = status;
    if (status === 'RESOLVED') {
      req.resolvedAt = new Date();
      if (resolutionNotes) req.resolutionNotes = resolutionNotes;
    }
    return req;
  },

  // RESOURCE METHODS
  async getResources() {
    if (isDbConnected()) {
      return await Resource.find()
        .populate('createdBy', 'name role')
        .populate('allocatedTo.request', 'category location status priority')
        .populate('allocatedTo.allocatedBy', 'name role')
        .sort({ createdAt: -1 });
    }
    return memoryResources;
  },

  async createResource(resData, user) {
    if (isDbConnected()) {
      return await Resource.create({ ...resData, createdBy: user._id });
    }
    const newRes = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...resData,
      availableQuantity: resData.quantity,
      allocatedTo: [],
      createdBy: { _id: user._id, name: user.name, role: user.role },
      createdAt: new Date()
    };
    memoryResources.unshift(newRes);
    return newRes;
  },

  async allocateResource(resourceId, { requestId, quantity, notes, user }) {
    if (isDbConnected()) {
      return await Resource.findOneAndUpdate(
        { _id: resourceId, availableQuantity: { $gte: quantity } },
        {
          $inc: { availableQuantity: -quantity },
          $push: {
            allocatedTo: {
              request: requestId,
              allocatedQuantity: quantity,
              allocatedAt: new Date(),
              allocatedBy: user._id,
              notes: notes || ''
            }
          }
        },
        { new: true }
      )
        .populate('allocatedTo.request', 'category location status priority')
        .populate('allocatedTo.allocatedBy', 'name role');
    }

    const res = memoryResources.find(r => r._id.toString() === resourceId.toString());
    if (!res) return { error: 'NOT_FOUND' };
    if (res.availableQuantity < quantity) return { error: 'INSUFFICIENT' };

    const targetReq = memoryRequests.find(r => r._id.toString() === requestId.toString());

    res.availableQuantity -= quantity;
    res.allocatedTo.push({
      _id: new mongoose.Types.ObjectId().toString(),
      request: targetReq ? {
        _id: targetReq._id,
        category: targetReq.category,
        location: targetReq.location,
        status: targetReq.status,
        priority: targetReq.priority
      } : requestId,
      allocatedQuantity: quantity,
      allocatedAt: new Date(),
      allocatedBy: { _id: user._id, name: user.name, role: user.role },
      notes: notes || ''
    });
    return res;
  },

  // ACTIVITY LOGS
  async createActivityLog(logData) {
    if (isDbConnected()) {
      try {
        return await ActivityLog.create(logData);
      } catch (e) {
        console.error('Failed to write ActivityLog to MongoDB:', e.message);
      }
    }
    const newLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...logData,
      createdAt: new Date()
    };
    memoryLogs.unshift(newLog);
    return newLog;
  },

  async getActivityLogs(filter = {}) {
    if (isDbConnected()) {
      const q = {};
      if (filter.action && filter.action !== 'ALL') q.action = filter.action;
      return await ActivityLog.find(q)
        .populate('user', 'name email role organization')
        .populate('request', 'category location priority status')
        .populate('resource', 'name type')
        .sort({ createdAt: -1 })
        .limit(Number(filter.limit || 50));
    }
    let list = [...memoryLogs];
    if (filter.action && filter.action !== 'ALL') {
      list = list.filter(l => l.action === filter.action);
    }
    return list.slice(0, Number(filter.limit || 50));
  },

  // STATS & COVERAGE
  async getDashboardStats() {
    let requests = [];
    let resources = [];
    let users = [];

    if (isDbConnected()) {
      requests = await EmergencyRequest.find().lean();
      resources = await Resource.find().lean();
      users = await User.find().lean();
    } else {
      requests = memoryRequests;
      resources = memoryResources;
      users = memoryUsers;
    }

    const overview = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      assigned: requests.filter(r => r.status === 'ASSIGNED').length,
      inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
      resolved: requests.filter(r => r.status === 'RESOLVED').length,
      activeOperations: requests.filter(r => ['ASSIGNED', 'IN_PROGRESS'].includes(r.status)).length
    };

    const priority = {
      critical: requests.filter(r => r.priority === 'CRITICAL').length,
      high: requests.filter(r => r.priority === 'HIGH').length,
      medium: requests.filter(r => r.priority === 'MEDIUM').length,
      low: requests.filter(r => r.priority === 'LOW').length
    };

    const categories = {
      Food: requests.filter(r => r.category === 'Food').length,
      Medical: requests.filter(r => r.category === 'Medical').length,
      Shelter: requests.filter(r => r.category === 'Shelter').length,
      Rescue: requests.filter(r => r.category === 'Rescue').length
    };

    let totalStock = 0;
    let availableStock = 0;
    let allocatedUnits = 0;
    resources.forEach(r => {
      totalStock += r.quantity || 0;
      availableStock += r.availableQuantity || 0;
      allocatedUnits += ((r.quantity || 0) - (r.availableQuantity || 0));
    });

    const userCounts = {
      CITIZEN: users.filter(u => u.role === 'CITIZEN').length,
      NGO: users.filter(u => u.role === 'NGO').length,
      VOLUNTEER: users.filter(u => u.role === 'VOLUNTEER').length,
      GOVERNMENT: users.filter(u => u.role === 'GOVERNMENT').length,
      ADMIN: users.filter(u => u.role === 'ADMIN').length
    };

    return {
      overview,
      priority,
      categories,
      resources: {
        totalStock,
        availableStock,
        allocatedUnits,
        itemCount: resources.length
      },
      users: userCounts
    };
  }
};
