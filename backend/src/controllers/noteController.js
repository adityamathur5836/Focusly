const prisma = require('../utils/prisma');
const handleDbError = require('../utils/handleDbError');

const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(notes);
  } catch (error) {
    handleDbError(error, res, 'Failed to fetch notes');
  }
};

const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json(note);
  } catch (error) {
    handleDbError(error, res, 'Failed to fetch note');
  }
};

const getRecentNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.status(200).json(notes);
  } catch (error) {
    handleDbError(error, res, 'Failed to fetch recent notes');
  }
};
const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please add title and content' });
    }

    console.log('Creating note - User ID:', req.user.id);
    console.log('Title:', title);

    const note = await prisma.note.create({
      data: {
        title,
        content,
        tags,
        userId: req.user.id,
      },
    });

    console.log('Note created successfully:', {
      id: note.id,
      title: note.title,
      userId: note.userId
    });

    res.status(201).json(note);
  } catch (error) {
    handleDbError(error, res, 'Failed to create note');
  }
};
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        tags,
      },
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    handleDbError(error, res, 'Failed to update note');
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await prisma.note.delete({
      where: { id },
    });

    res.status(200).json({ id });
  } catch (error) {
    handleDbError(error, res, 'Failed to delete note');
  }
};

module.exports = {
  getNotes,
  getNote,
  getRecentNotes,
  createNote,
  updateNote,
  deleteNote,
};
