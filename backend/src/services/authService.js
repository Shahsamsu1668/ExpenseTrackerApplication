const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

/**
 * Generates a signed JWT for the given user.
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Strips sensitive fields from a user record before sending to client.
 */
const sanitizeUser = (user) => {
  const { passwordHash, ...safe } = user;
  return safe;
};

/**
 * Registers a new user account.
 * Checks for existing email, hashes password, creates user, returns token.
 */
const register = async ({ fullName, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { fullName, email, passwordHash },
  });

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

/**
 * Authenticates a user with email/password.
 * Throws 401 for any auth failure (does not reveal which field is wrong).
 */
const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

/**
 * Returns the current authenticated user's profile.
 */
const getMe = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return sanitizeUser(user);
};

/**
 * Updates the user's profile picture.
 */
const updateProfilePicture = async (userId, imageUrl) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { profilePicture: imageUrl },
  });
  return sanitizeUser(user);
};

module.exports = { register, login, getMe, updateProfilePicture };
