import { Storage } from '../services/storageService.js';

export const getResources = async (req, res, next) => {
  try {
    const resources = await Storage.getResources();
    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    next(err);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const { name, type, quantity, location } = req.body;

    if (!name || !type || quantity === undefined || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, type, quantity, location'
      });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }

    const resource = await Storage.createResource({
      name,
      type,
      quantity: qty,
      location
    }, req.user);

    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'RESOURCE_CREATED',
      details: `Registered resource "${name}" (${qty} units of ${type}) at warehouse: ${location}`,
      resource: resource._id
    });

    res.status(201).json({
      success: true,
      message: 'Resource registered successfully',
      data: resource
    });
  } catch (err) {
    next(err);
  }
};

export const allocateResource = async (req, res, next) => {
  try {
    const { requestId, quantity, notes } = req.body;
    const allocQty = Number(quantity);

    if (!requestId || !allocQty || allocQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid requestId and a positive allocation quantity'
      });
    }

    const emergencyRequest = await Storage.getRequestById(requestId);
    if (!emergencyRequest) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request to allocate to was not found'
      });
    }

    const result = await Storage.allocateResource(req.params.id, {
      requestId,
      quantity: allocQty,
      notes,
      user: req.user
    });

    if (result && result.error === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (result && result.error === 'INSUFFICIENT') {
      return res.status(400).json({
        success: false,
        message: `Insufficient inventory available for allocation`
      });
    }

    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'RESOURCE_ALLOCATED',
      details: `Allocated ${allocQty} units of relief supplies to request #${emergencyRequest._id.toString().slice(-6)} [${emergencyRequest.category} at ${emergencyRequest.location}]`,
      resource: req.params.id,
      request: emergencyRequest._id,
      metadata: { allocatedQuantity: allocQty }
    });

    res.json({
      success: true,
      message: `Successfully allocated ${allocQty} units of supplies`,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
