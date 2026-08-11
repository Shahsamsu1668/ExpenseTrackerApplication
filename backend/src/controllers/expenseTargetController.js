const expenseTargetService = require('../services/expenseTargetService');
const { expenseTargetSchema } = require('../validators/expenseTargetValidators');

const getTarget = async (req, res, next) => {
  try {
    const target = await expenseTargetService.getTarget(req.user.id);
    res.status(200).json({ success: true, data: target });
  } catch (error) { next(error); }
};

const setTarget = async (req, res, next) => {
  try {
    const data = expenseTargetSchema.parse(req.body);
    const target = await expenseTargetService.setTarget(req.user.id, data);
    res.status(200).json({ success: true, message: 'Expense target saved', data: target });
  } catch (error) { next(error); }
};

const deleteTarget = async (req, res, next) => {
  try {
    await expenseTargetService.deleteTarget(req.user.id);
    res.status(200).json({ success: true, message: 'Expense target removed' });
  } catch (error) { next(error); }
};

const getStatus = async (req, res, next) => {
  try {
    const status = await expenseTargetService.getStatus(req.user.id);
    res.status(200).json({ success: true, data: status });
  } catch (error) { next(error); }
};

module.exports = { getTarget, setTarget, deleteTarget, getStatus };
