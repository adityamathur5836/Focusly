import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "@ditya_5934";

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Email exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    message: "User registered",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});
