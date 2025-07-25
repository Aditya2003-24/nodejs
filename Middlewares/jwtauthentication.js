import jwt from "jsonwebtoken";

const secretkey = "DAIRY_BACKEND";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretkey, { expiresIn: "7d" });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
 
  console.log(token)

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Token not found" });
  }

  try {
    const decoded = jwt.verify(token, secretkey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export { generateToken, authenticateToken };
