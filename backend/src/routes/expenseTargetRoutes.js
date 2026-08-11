const express = require('express');
const { getTarget, setTarget, deleteTarget, getStatus } = require('../controllers/expenseTargetController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', getTarget);
router.post('/', setTarget);
router.put('/', setTarget);
router.delete('/', deleteTarget);
router.get('/status', getStatus);

module.exports = router;
