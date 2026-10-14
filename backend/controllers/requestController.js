import { Storage } from '../services/storageService.js';
import { calculatePriority } from '../utils/priority.js';
import { detectDuplicate } from '../utils/duplicate.js';

export const createRequest = async (req, res, next) => {
  try {
    const {
      category,
      description,
      location,
      latitude,
      longitude,
      peopleAffected,
      contactPhone
    } = req.body;

    if (!category || !description || !location || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: category, description, location, latitude, longitude'
      });
    }

    // 1. Calculate rule-based priority
    const { priority, reason: priorityReason } = calculatePriority({
      category,
      description,
      peopleAffected: Number(peopleAffected) || 1
    });

    // 2. Fetch active requests for rule-based duplicate detection
    const recentRequests = await Storage.getRecentActiveRequests();

    // 3. Evaluate duplicate rules (same category, within 500m, active status)
    const duplicateResult = detectDuplicate(
      {
        category,
        description,
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      recentRequests
    );

    // 4. Create request
    const newRequest = await Storage.createRequest({
      citizen: req.user._id,
      category,
      description,
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
      peopleAffected: Number(peopleAffected) || 1,
      contactPhone: contactPhone || req.user.phone || '',
      priority,
      priorityReason,
      duplicateOf: duplicateResult.duplicateOf,
      duplicateScore: duplicateResult.score,
      duplicateWarning: duplicateResult.warning
    });

    // 5. Activity Logging
    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'REQUEST_CREATED',
      details: `New emergency request created for [${category}] at "${location}" with priority [${priority}]`,
      request: newRequest._id,
      metadata: {
        category,
        priority,
        location,
        isDuplicate: duplicateResult.isDuplicate
      }
    });

    if (duplicateResult.isDuplicate) {
      await Storage.createActivityLog({
        user: req.user._id,
        userName: req.user.name,
        userRole: req.user.role,
        action: 'DUPLICATE_FLAGGED',
        details: duplicateResult.warning,
        request: newRequest._id,
        metadata: {
          duplicateOf: duplicateResult.duplicateOf,
          duplicateScore: duplicateResult.score
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Emergency request submitted successfully',
      data: newRequest
    });
  } catch (err) {
    next(err);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const {
      category,
      priority,
      status,
      isDuplicate,
      myRequests,
      myClaimed,
      search
    } = req.query;

    const filters = {};

    if (myRequests === 'true' || req.user.role === 'CITIZEN') {
      filters.citizen = req.user._id;
    }
    if (myClaimed === 'true') {
      filters.assignedTo = req.user._id;
    }
    if (category) filters.category = category;
    if (priority) filters.priority = priority;
    if (status) filters.status = status;
    if (isDuplicate === 'true') filters.isDuplicate = true;
    if (search) filters.search = search;

    const requests = await Storage.getRequests(filters);

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};

export const getRequestById = async (req, res, next) => {
  try {
    const request = await Storage.getRequestById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    const citizenId = request.citizen?._id || request.citizen;
    if (
      req.user.role === 'CITIZEN' &&
      citizenId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (err) {
    next(err);
  }
};

export const claimRequest = async (req, res, next) => {
  try {
    const result = await Storage.claimRequest(req.params.id, req.user);

    if (!result || result.error === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (result.error === 'ALREADY_CLAIMED') {
      const assigned = result.current?.assignedTo;
      const assignedName = assigned?.name || 'another team';
      return res.status(409).json({
        success: false,
        message: `This request was already claimed by ${assignedName} and is currently ${result.current?.status}.`
      });
    }

    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'REQUEST_CLAIMED',
      details: `${req.user.role} "${req.user.name}" claimed request #${result._id.toString().slice(-6)} [${result.category}] at ${result.location}`,
      request: result._id
    });

    res.json({
      success: true,
      message: 'Request successfully claimed and assigned to your team',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

export const updateRequestStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const allowedStatuses = ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const request = await Storage.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const assignedId = request.assignedTo?._id || request.assignedTo;
    const isAssigned = assignedId && assignedId.toString() === req.user._id.toString();
    const isGovOrAdmin = ['GOVERNMENT', 'ADMIN'].includes(req.user.role);

    if (!isAssigned && !isGovOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned responder, Government authorities, or Admins can update this status.'
      });
    }

    const previousStatus = request.status;
    const updated = await Storage.updateRequestStatus(req.params.id, status, resolutionNotes, req.user);

    const actionType = status === 'RESOLVED' ? 'REQUEST_RESOLVED' : 'STATUS_UPDATED';
    await Storage.createActivityLog({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: actionType,
      details: `Status of request #${request._id.toString().slice(-6)} changed from ${previousStatus} to ${status}${resolutionNotes ? `. Note: ${resolutionNotes}` : ''}`,
      request: request._id,
      metadata: { previousStatus, newStatus: status, resolutionNotes }
    });

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

export const updateRequest = async (req, res, next) => {
  try {
    const request = await Storage.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const citizenId = request.citizen?._id || request.citizen;
    const isOwner = citizenId.toString() === req.user._id.toString();
    const isGovOrAdmin = ['GOVERNMENT', 'ADMIN'].includes(req.user.role);

    if (!isOwner && !isGovOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this request'
      });
    }

    const { description, location, contactPhone, peopleAffected } = req.body;
    if (description) request.description = description;
    if (location) request.location = location;
    if (contactPhone) request.contactPhone = contactPhone;
    if (peopleAffected) request.peopleAffected = Number(peopleAffected);

    if (request.save) {
      await request.save();
    }

    res.json({
      success: true,
      message: 'Request details updated successfully',
      data: request
    });
  } catch (err) {
    next(err);
  }
};
