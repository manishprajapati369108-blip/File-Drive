import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Optional: also allow Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    next();

  } catch (error) {
    console.error(error);

    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};