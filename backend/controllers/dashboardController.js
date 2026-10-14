import { Storage } from '../services/storageService.js';
import { calculateDistanceMeters } from '../utils/distance.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await Storage.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

export const getCoverageGaps = async (req, res, next) => {
  try {
    const requests = await Storage.getRequests();
    const activeRequests = requests.filter(r => ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(r.status));

    if (activeRequests.length === 0) {
      return res.json({
        success: true,
        disclaimer: 'Approximate operational indicator for humanitarian coordination, not an official GIS demarcation.',
        clusters: [],
        totalGapsIdentified: 0
      });
    }

    const CLUSTER_DISTANCE = 2500; // 2.5km cluster radius
    const clusters = [];

    for (const reqItem of activeRequests) {
      let matchedCluster = null;

      for (const cl of clusters) {
        const dist = calculateDistanceMeters(
          reqItem.latitude,
          reqItem.longitude,
          cl.centerLat,
          cl.centerLng
        );
        if (dist <= CLUSTER_DISTANCE) {
          matchedCluster = cl;
          break;
        }
      }

      if (matchedCluster) {
        matchedCluster.requests.push(reqItem);
        const n = matchedCluster.requests.length;
        matchedCluster.centerLat = (matchedCluster.centerLat * (n - 1) + reqItem.latitude) / n;
        matchedCluster.centerLng = (matchedCluster.centerLng * (n - 1) + reqItem.longitude) / n;
      } else {
        clusters.push({
          clusterId: `CLUSTER-${clusters.length + 1}`,
          regionName: reqItem.location || `Zone near Lat ${reqItem.latitude.toFixed(3)}, Lng ${reqItem.longitude.toFixed(3)}`,
          centerLat: reqItem.latitude,
          centerLng: reqItem.longitude,
          requests: [reqItem]
        });
      }
    }

    const gapAnalysis = clusters.map(cl => {
      const total = cl.requests.length;
      const pendingCount = cl.requests.filter(r => r.status === 'PENDING').length;
      const assignedCount = cl.requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS').length;
      const criticalCount = cl.requests.filter(r => r.priority === 'CRITICAL').length;
      const totalAffected = cl.requests.reduce((sum, r) => sum + (r.peopleAffected || 1), 0);

      let coverageStatus = 'OPTIMAL_COVERAGE';
      let severityBadge = 'LOW';
      let recommendation = 'Relief response currently meeting demand.';

      if (pendingCount > 0 && assignedCount === 0) {
        if (criticalCount > 0 || pendingCount >= 2) {
          coverageStatus = 'CRITICAL_GAP';
          severityBadge = 'CRITICAL';
          recommendation = 'Zero responders deployed with critical/multiple pending emergencies. Immediate team dispatch recommended!';
        } else {
          coverageStatus = 'MODERATE_GAP';
          severityBadge = 'HIGH';
          recommendation = 'Unattended pending requests detected. Assign nearest volunteer or NGO unit.';
        }
      } else if (pendingCount > assignedCount * 2) {
        coverageStatus = 'HIGH_DEMAND_GAP';
        severityBadge = 'MEDIUM';
        recommendation = 'Responders deployed but incoming emergencies outpace current local capacity.';
      } else {
        coverageStatus = 'ACTIVE_OPERATION';
        severityBadge = 'RESOLVING';
        recommendation = 'Responders active and handling requests in this zone.';
      }

      return {
        id: cl.clusterId,
        area: cl.regionName,
        centerLat: Number(cl.centerLat.toFixed(5)),
        centerLng: Number(cl.centerLng.toFixed(5)),
        activeRequestCount: total,
        pendingCount,
        assignedCount,
        criticalCount,
        totalPeopleAffected: totalAffected,
        coverageStatus,
        severity: severityBadge,
        recommendation
      };
    });

    const severityOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, RESOLVING: 4, LOW: 5 };
    gapAnalysis.sort((a, b) => (severityOrder[a.severity] || 9) - (severityOrder[b.severity] || 9));

    const totalGaps = gapAnalysis.filter(g => g.coverageStatus !== 'ACTIVE_OPERATION' && g.coverageStatus !== 'OPTIMAL_COVERAGE').length;

    res.json({
      success: true,
      disclaimer: 'Approximate operational indicator for humanitarian coordination, not an official GIS demarcation.',
      totalGapsIdentified: totalGaps,
      clusters: gapAnalysis
    });
  } catch (err) {
    next(err);
  }
};

export const getMapData = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const requests = await Storage.getRequests({
      status: status !== 'ALL' ? status : undefined,
      category: category !== 'ALL' ? category : undefined,
      priority: priority !== 'ALL' ? priority : undefined
    });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (err) {
    next(err);
  }
};
