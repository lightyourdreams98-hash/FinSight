const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  // Get authorization header
  const authHeader = req.headers.authorization;

  // Check whether token exists
  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  // Expected format:
  // Bearer TOKEN
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication format"
    });
  }

  try {

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user information in request
    req.user = decoded;

    // Continue to route
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    });

  }
};

module.exports = authMiddleware;