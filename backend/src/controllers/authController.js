const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (user) {
      const token = generateToken(user.id);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: token 
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message && error.message.includes('authentication failed')) {
      return res.status(500).json({ 
        message: 'Database connection error. Please check server configuration.',
        error: 'DATABASE_AUTH_FAILED'
      });
    }
    res.status(500).json({ 
      message: 'Failed to register user',
      error: error.message 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.message && error.message.includes('authentication failed')) {
      return res.status(500).json({ 
        message: 'Database connection error. Please check server configuration.',
        error: 'DATABASE_AUTH_FAILED'
      });
    }
    res.status(500).json({ 
      message: 'Failed to login',
      error: error.message 
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logout,
};
