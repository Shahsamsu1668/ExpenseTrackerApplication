const express = require('express');
const { register, login, getMe, uploadProfilePicture } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/profile-picture', authenticate, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
