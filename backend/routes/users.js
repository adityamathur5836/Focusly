// backend/routes/users.js or inside server.js
import express from "express";
import prisma from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/api/users/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (req.user.id !== id) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { notes: true, flashcards: true, voices: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      name: user.name,
      email: user.email,
      stats: {
        notes: user.notes.length,
        flashcards: user.flashcards.length,
        voices: user.voices.length,
      },
      recent: [
        ...user.notes
          .slice(-2)
          .map((n) => ({ type: "note", name: n.title, date: n.createdAt })),
        ...user.flashcards
          .slice(-2)
          .map((f) => ({ type: "flash", name: f.question, date: f.createdAt })),
        ...user.voices
          .slice(-1)
          .map((v) => ({ type: "voice", name: v.title, date: v.createdAt })),
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
