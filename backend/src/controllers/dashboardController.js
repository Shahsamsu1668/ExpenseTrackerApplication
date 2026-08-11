const dashboardService = require('../services/dashboardService');

/**
 * GET /api/dashboard/summary
 */
const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardSummary(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
