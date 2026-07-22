// middleware/auth.js
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    // ✅ Get token from header
    const authHeader = req.headers.authorization;
    console.log("🔑 Auth Header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ No token provided");
      return res.status(401).json({ 
        success: false,
        error: 'Not authorized, no token' 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("🔑 Token:", token.substring(0, 20) + "...");
    
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);
    
    // ✅ Attach user to request
    req.user = {
      id: decoded.userId,  // ← Make sure this matches your JWT
      email: decoded.email
    };
    
    console.log("✅ User attached:", req.user);
    next();
    
  } catch (error) {
    console.error("❌ Auth error:", error);
    res.status(401).json({ 
      success: false,
      error: 'Invalid token' 
    });
  }
};  