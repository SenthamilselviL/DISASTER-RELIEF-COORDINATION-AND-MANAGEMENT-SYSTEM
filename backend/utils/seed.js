import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import EmergencyRequest from '../models/EmergencyRequest.js';
import Resource from '../models/Resource.js';
import ActivityLog from '../models/ActivityLog.js';
import { calculatePriority } from './priority.js';
import { calculateDistanceMeters } from './distance.js';

dotenv.config();

export const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster_relief';

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('[Seed] Connected to database');
    }

    console.log('[Seed] Ensuring demo users exist...');
    const demoUserData = [
      {
        name: 'Karthik Raman (Citizen)',
        email: 'citizen@example.com',
        phone: '+91 98401 23456',
        password: 'Password123!',
        role: 'CITIZEN'
      },
      {
        name: 'Relief India Foundation',
        email: 'ngo@example.com',
        phone: '+91 98402 34567',
        password: 'Password123!',
        role: 'NGO',
        organization: 'Relief India Foundation NGO'
      },
      {
        name: 'Arun Kumar (Disaster Volunteer)',
        email: 'volunteer@example.com',
        phone: '+91 98403 45678',
        password: 'Password123!',
        role: 'VOLUNTEER',
        organization: 'Tamil Nadu Youth Relief Force'
      },
      {
        name: 'Disaster Management Authority',
        email: 'government@example.com',
        phone: '+91 98404 56789',
        password: 'Password123!',
        role: 'GOVERNMENT',
        organization: 'State Disaster Management Control Room'
      },
      {
        name: 'System Administrator',
        email: 'admin@example.com',
        phone: '+91 98405 67890',
        password: 'Password123!',
        role: 'ADMIN',
        organization: 'Central Incident Management Unit'
      }
    ];

    const users = [];
    for (const u of demoUserData) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
      }
      users.push(existing);
    }

    const citizen = users[0];
    const ngo = users[1];
    const volunteer = users[2];
    const gov = users[3];
    const admin = users[4];

    console.log('[Seed] Ensuring relief resources exist...');
    const resourceData = [
      {
        name: 'Emergency Dry Ration & Food Packets',
        type: 'Food Kits',
        quantity: 2500,
        availableQuantity: 2150,
        location: 'Central Civil Supplies Warehouse, Koyambedu, Chennai',
        createdBy: gov._id
      },
      {
        name: 'Mobile Trauma Care & Essential Drug Kits',
        type: 'Medical Supplies',
        quantity: 500,
        availableQuantity: 420,
        location: 'Rajiv Gandhi Government General Hospital Depot, Chennai',
        createdBy: gov._id
      },
      {
        name: 'Inflatable Rescue Boats & Life Jackets',
        type: 'Rescue Teams',
        quantity: 50,
        availableQuantity: 38,
        location: 'Saidapet Fire & Rescue Central Station, Chennai',
        createdBy: gov._id
      },
      {
        name: 'Waterproof Relief Tents & Tarpaulin Units',
        type: 'Shelter Units',
        quantity: 400,
        availableQuantity: 320,
        location: 'Tambaram Emergency Shelter Stockpile, Chennai',
        createdBy: gov._id
      },
      {
        name: 'Clean Drinking Water Cans (20 Litre)',
        type: 'Food Kits',
        quantity: 5000,
        availableQuantity: 4100,
        location: 'Kilpauk Water Works Storage, Chennai',
        createdBy: gov._id
      }
    ];

    const resources = [];
    for (const res of resourceData) {
      let existingRes = await Resource.findOne({ name: res.name });
      if (!existingRes) {
        existingRes = await Resource.create(res);
      }
      resources.push(existingRes);
    }

    console.log('[Seed] Ensuring realistic demo emergency requests exist...');
    // Seed realistic emergency requests across Chennai coordinates
    const requestData = [
      {
        citizen: citizen._id,
        category: 'Rescue',
        description: 'Water rising rapidly above 5 feet inside ground floor houses. Elderly residents and 2 children stranded on rooftop. Immediate boat evacuation urgently needed!',
        location: 'Bhuvaneshwari Nagar, Velachery, Chennai',
        latitude: 12.9815,
        longitude: 80.2180,
        peopleAffected: 6,
        contactPhone: '+91 98401 23456',
        priority: 'CRITICAL',
        priorityReason: 'Immediate physical peril, trapped victims, or life-threatening environmental hazard',
        status: 'PENDING'
      },
      {
        citizen: citizen._id,
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
        assignedTo: ngo._id,
        assignedAt: new Date(Date.now() - 3600000 * 2)
      },
      {
        citizen: citizen._id,
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
        assignedTo: volunteer._id,
        assignedAt: new Date(Date.now() - 3600000 * 4)
      },
      {
        citizen: citizen._id,
        category: 'Shelter',
        description: 'Sheet roofs blown away by heavy wind gusts. 12 people including 3 infants currently exposed in pouring rain.',
        location: 'Ram Nagar South Extension, Madipakkam, Chennai',
        latitude: 12.9647,
        longitude: 80.1961,
        peopleAffected: 12,
        contactPhone: '+91 97910 11223',
        priority: 'HIGH',
        priorityReason: 'Urgent shelter requirement for vulnerable demographics or large group without roof',
        status: 'PENDING'
      },
      {
        citizen: citizen._id,
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
        assignedTo: ngo._id,
        assignedAt: new Date(Date.now() - 3600000 * 8),
        resolvedAt: new Date(Date.now() - 3600000 * 1),
        resolutionNotes: 'Delivered 25 water cans and 20 relief ration boxes via NDRF tractor.'
      },
      {
        citizen: citizen._id,
        category: 'Medical',
        description: 'Minor fever and need baby formula milk for 6-month-old infant. Family safe on first floor.',
        location: 'Paper Mills Road, Perambur, Chennai',
        latitude: 13.1118,
        longitude: 80.2435,
        peopleAffected: 3,
        contactPhone: '+91 93810 66778',
        priority: 'HIGH',
        priorityReason: 'Medical assistance urgently needed for vulnerable individuals or small group',
        status: 'PENDING'
      },
      {
        citizen: citizen._id,
        category: 'Rescue',
        description: 'Tree collapsed onto entry gate and transformer spark spotted. Road blocked, 4 people unable to step out.',
        location: 'Suryanarayana St, Royapuram, Chennai',
        latitude: 13.1147,
        longitude: 80.2974,
        peopleAffected: 4,
        contactPhone: '+91 95000 88990',
        priority: 'HIGH',
        priorityReason: 'Standard rescue and evacuation assistance needed',
        status: 'PENDING'
      }
    ];

    const existingCount = await EmergencyRequest.countDocuments();
    let createdRequests = [];
    let duplicateRequest = null;
    let primaryVelacheryReq = null;

    if (existingCount === 0) {
      createdRequests = await EmergencyRequest.create(requestData);
      primaryVelacheryReq = createdRequests[0];
      duplicateRequest = await EmergencyRequest.create({
        citizen: citizen._id,
        category: 'Rescue',
        description: 'Water rising in houses on Bhuvaneshwari Nagar 3rd street. Trapped families on roof need boat rescue!',
        location: '3rd Cross St, Bhuvaneshwari Nagar, Velachery, Chennai',
        latitude: 12.9822, // ~100m from primary request
        longitude: 80.2185,
        peopleAffected: 4,
        contactPhone: '+91 98401 99999',
        priority: 'CRITICAL',
        priorityReason: 'Immediate physical peril, trapped victims, or life-threatening environmental hazard',
        status: 'PENDING',
        duplicateOf: primaryVelacheryReq._id,
        duplicateScore: 92,
        duplicateWarning: `Possible duplicate of request #${primaryVelacheryReq._id.toString().slice(-6)} (Rescue at ${primaryVelacheryReq.location}, 95 m away, status: ${primaryVelacheryReq.status})`
      });

      console.log('[Seed] Seeding activity audit logs...');
      await ActivityLog.create([
        {
          user: gov._id,
          userName: gov.name,
          userRole: gov.role,
          action: 'RESOURCE_CREATED',
          details: 'Initial emergency relief supplies allocated from State Central Reserve',
          resource: resources[0]._id
        },
        {
          user: citizen._id,
          userName: citizen.name,
          userRole: citizen.role,
          action: 'REQUEST_CREATED',
          details: `Emergency Rescue request submitted for ${primaryVelacheryReq.location}`,
          request: primaryVelacheryReq._id
        },
        {
          user: citizen._id,
          userName: citizen.name,
          userRole: citizen.role,
          action: 'DUPLICATE_FLAGGED',
          details: duplicateRequest.duplicateWarning,
          request: duplicateRequest._id
        },
        {
          user: ngo._id,
          userName: ngo.name,
          userRole: ngo.role,
          action: 'REQUEST_CLAIMED',
          details: `Relief India Foundation claimed Medical emergency in Adyar`,
          request: createdRequests[1]._id
        },
        {
          user: volunteer._id,
          userName: volunteer.name,
          userRole: volunteer.role,
          action: 'STATUS_UPDATED',
          details: `Volunteer updated Tambaram food request status to IN_PROGRESS`,
          request: createdRequests[2]._id
        },
        {
          user: ngo._id,
          userName: ngo.name,
          userRole: ngo.role,
          action: 'REQUEST_RESOLVED',
          details: `Saidapet drinking water request successfully resolved`,
          request: createdRequests[4]._id
        }
      ]);
    } else {
      console.log(`[Seed] ${existingCount} emergency requests already exist. Skipping demo request insertion.`);
    }

    console.log('\x1b[32m%s\x1b[0m', '=======================================================');
    console.log('\x1b[32m%s\x1b[0m', ' [SUCCESS] Database Seeded Successfully!');
    console.log('\x1b[32m%s\x1b[0m', '=======================================================');
    console.log(' Demo Accounts Created (Password: Password123!):');
    console.log(' - Citizen:    citizen@example.com');
    console.log(' - NGO:        ngo@example.com');
    console.log(' - Volunteer:  volunteer@example.com');
    console.log(' - Government: government@example.com');
    console.log(' - Admin:      admin@example.com');
    console.log('-------------------------------------------------------');
    console.log(` Seeded: ${users.length} Users, ${createdRequests.length + 1} Emergency Requests, ${resources.length} Resource Pools`);
    console.log('=======================================================\n');

    return true;
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    throw err;
  }
};

// Allow direct CLI execution: node utils/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
