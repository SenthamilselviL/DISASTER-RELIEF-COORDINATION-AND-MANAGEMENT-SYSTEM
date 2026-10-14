import { Storage } from '../services/storageService.js';

export const getActivityLogs = async (req, res, next) => {
  try {
    const { action, limit = 50 } = req.query;
    const logs = await Storage.getActivityLogs({ action, limit });
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};
