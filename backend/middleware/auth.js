import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "focusly_secret_key";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.cookies?.token;
  if (!authHeader) return res.status(401).json({ error: "No authorization" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
