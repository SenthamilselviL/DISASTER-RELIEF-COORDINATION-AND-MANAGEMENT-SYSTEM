import { Storage } from '../services/storageService.js';

export const getUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;
    const users = await Storage.getAllUsers({ role, search, status });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['CITIZEN', 'NGO', 'VOLUNTEER', 'GOVERNMENT', 'ADMIN'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${allowedRoles.join(', ')}`
      });
    }

    const updated = await Storage.updateUserRole(req.params.id, role);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_ROLE_CHANGED',
      details: `Admin changed role of user "${updated.name}" (${updated.email}) to ${role}`
    });

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own administrative account'
      });
    }

    const updated = await Storage.toggleUserStatus(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_STATUS_CHANGED',
      details: `Admin ${updated.isActive ? 'activated' : 'deactivated'} user account "${updated.name}" (${updated.email})`
    });

    res.json({
      success: true,
      message: `User account ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
