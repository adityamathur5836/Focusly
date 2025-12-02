const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', {
      body: req.body,
      contentType: req.get('content-type'),
      method: req.method,
      headers: {
        'content-type': req.get('content-type'),
        'origin': req.get('origin'),
        'authorization': req.get('authorization') ? 'present' : 'missing'
      }
    });

    // Check if body is empty or undefined
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Empty request body received');
      return res.status(400).json({ 
        message: 'Request body is empty. Please provide name, email, and password.',
        error: 'EMPTY_BODY'
      });
    }

    const { name, email, password } = req.body;

    console.log('Registration attempt:', { 
      name: name || 'MISSING', 
      email: email || 'MISSING', 
      hasPassword: !!password,
      nameType: typeof name,
      emailType: typeof email,
      passwordType: typeof password
    });

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed - missing fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ 
        message: 'Please add all fields',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    console.log('Checking if user exists...');
    let userExists;
    try {
      userExists = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error('Database error checking user:', dbError);
      if (dbError.message && dbError.message.includes('authentication failed')) {
        return res.status(500).json({ 
          message: 'Database connection error. Please check server configuration.',
          error: 'DATABASE_AUTH_FAILED'
        });
      }
      throw dbError;
    }

    if (userExists) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    console.log('Creating new user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('User created successfully:', user.id);

    const token = generateToken(user.id);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (matching token expiry)
      domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // Let browser handle domain
    });
    
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    if (error.message && error.message.includes('authentication failed')) {
      return res.status(500).json({ 
        message: 'Database connection error. Please check server configuration.',
        error: 'DATABASE_AUTH_FAILED'
      });
    }
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        error: 'DUPLICATE_EMAIL'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to register user',
      error: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (matching token expiry)
        domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // Let browser handle domain
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
