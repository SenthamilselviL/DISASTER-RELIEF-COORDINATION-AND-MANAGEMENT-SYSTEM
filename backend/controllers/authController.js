import jwt from 'jsonwebtoken';
import { Storage } from '../services/storageService.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'disaster_relief_jwt_secret_key_super_secure_2025',
    { expiresIn: '30d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, organization } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password'
      });
    }

    const requestedRole = (role || 'CITIZEN').toUpperCase();
    const allowedPublicRoles = ['CITIZEN', 'NGO', 'VOLUNTEER'];

    if (!allowedPublicRoles.includes(requestedRole)) {
      return res.status(403).json({
        success: false,
        message: `Public registration is not permitted for '${requestedRole}'. Government and Admin accounts are managed by administrators.`
      });
    }

    const existingUser = await Storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const user = await Storage.createUser({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: requestedRole,
      organization: organization || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await Storage.findUserByEmail(email, true);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await Storage.findUserById(req.user._id || req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};
