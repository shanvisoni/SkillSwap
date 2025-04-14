import jwt from 'jsonwebtoken';
import User from '../models/User.js';



const protect = async (req, res, next) => {
  console.log("📡 Full Headers:", req.headers); // Debugging full headers

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Extracted Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("🆔 Authenticated User:", req.user);

      next();
    } catch (error) {
      console.error("❌ JWT Verification Error:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    console.error("🚫 No Authorization Header Provided");
    console.log("📡 Received Headers:", req.headers); // Log full headers
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;




