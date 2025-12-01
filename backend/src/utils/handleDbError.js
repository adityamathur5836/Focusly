// Utility function to handle database errors consistently
const handleDbError = (error, res, defaultMessage = 'Database error occurred') => {
  console.error('Database error:', error);
  
  if (error.message && error.message.includes('authentication failed')) {
    return res.status(500).json({ 
      message: 'Database connection error. Please check server configuration.',
      error: 'DATABASE_AUTH_FAILED',
      details: 'MongoDB authentication failed. Verify DATABASE_URL credentials.'
    });
  }
  
  if (error.message && error.message.includes('timeout')) {
    return res.status(500).json({ 
      message: 'Database connection timeout. Please try again.',
      error: 'DATABASE_TIMEOUT'
    });
  }
  
  if (error.message && error.message.includes('network')) {
    return res.status(500).json({ 
      message: 'Database network error. Please check connection.',
      error: 'DATABASE_NETWORK_ERROR'
    });
  }
  
  return res.status(500).json({ 
    message: defaultMessage,
    error: error.message || 'Unknown database error'
  });
};

module.exports = handleDbError;

