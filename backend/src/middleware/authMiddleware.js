const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true },
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (dbError) {
      console.error('Database error in auth middleware:', dbError);
      if (dbError.message && dbError.message.includes('authentication failed')) {
        return res.status(500).json({ 
          message: 'Database connection error. Please check server configuration.',
          error: 'DATABASE_AUTH_FAILED'
        });
      }
      return res.status(500).json({ 
        message: 'Database error',
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
