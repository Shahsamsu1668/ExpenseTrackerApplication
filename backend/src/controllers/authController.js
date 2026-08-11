const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../validators/authValidators');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({ success: true, message: 'Account created successfully', data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me  (protected)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/profile-picture (protected)
 */
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    
    // Create the image URL (assuming server runs on process.env.SERVER_URL or just relative path)
    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    
    const user = await authService.updateProfilePicture(req.user.id, imageUrl);
    res.status(200).json({ success: true, message: 'Profile picture updated', data: { user } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, uploadProfilePicture };
