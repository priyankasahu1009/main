import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-mysecret-key", (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ Error: "Token has expired" });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ Error: "Invalid token" });
        } else {
          return res.status(500).json({ Error: "Internal server error" });
        }
      } else {
        // Assuming the decoded token contains email instead of username
        req.email = decoded.email;
        next();
      }
    });
  }
};

export default verifyUser;
