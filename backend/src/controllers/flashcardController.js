const prisma = require('../utils/prisma');

// @desc    Get all flashcard sets
// @route   GET /api/flashcards
// @access  Private
const getFlashcardSets = async (req, res) => {
  const sets = await prisma.flashcardSet.findMany({
    where: { userId: req.user.id },
    include: { cards: true },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json(sets);
};

// @desc    Create new flashcard set
// @route   POST /api/flashcards
// @access  Private
const createFlashcardSet = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a title' });
  }

  const set = await prisma.flashcardSet.create({
    data: {
      title,
      userId: req.user.id,
    },
  });

  res.status(201).json(set);
};

// @desc    Add card to set
// @route   POST /api/flashcards/:setId/cards
// @access  Private
const addCardToSet = async (req, res) => {
  const { setId } = req.params;
  const { front, back } = req.body;

  if (!front || !back) {
    return res.status(400).json({ message: 'Please add front and back content' });
  }

  const set = await prisma.flashcardSet.findUnique({
    where: { id: setId },
  });

  if (!set) {
    return res.status(404).json({ message: 'Set not found' });
  }

  if (set.userId !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const card = await prisma.flashcard.create({
    data: {
      front,
      back,
      setId,
    },
  });

  res.status(201).json(card);
};

// @desc    Delete flashcard set
// @route   DELETE /api/flashcards/:id
// @access  Private
const deleteFlashcardSet = async (req, res) => {
  const { id } = req.params;

  const set = await prisma.flashcardSet.findUnique({
    where: { id },
  });

  if (!set) {
    return res.status(404).json({ message: 'Set not found' });
  }

  if (set.userId !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await prisma.flashcardSet.delete({
    where: { id },
  });

  res.status(200).json({ id });
};

module.exports = {
  getFlashcardSets,
  createFlashcardSet,
  addCardToSet,
  deleteFlashcardSet,
};
