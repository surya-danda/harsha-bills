import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // 1. Get token from the 'x-auth-token' header
  const token = req.header('x-auth-token');

  // 2. Check if no token is present
  if (!token) {
    // This is a clear case of an unauthenticated request
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If valid, attach the user payload to the request object
    req.user = decoded.user;
    next(); // Proceed to the route handler
  } catch (err) {
    // --- IMPROVED LOGGING ---
    // Log the specific reason the token is invalid (e.g., "jwt expired")
    console.error(`Auth Middleware Error: ${err.message}`);
    
    // If not valid, send an error response
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;

