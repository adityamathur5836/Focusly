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

// @desc    Get single flashcard set
// @route   GET /api/flashcards/:id
// @access  Private
const getFlashcardSet = async (req, res) => {
  const { id } = req.params;

  const set = await prisma.flashcardSet.findUnique({
    where: { id },
    include: { cards: true },
  });

  if (!set) {
    return res.status(404).json({ message: 'Set not found' });
  }

  if (set.userId !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  res.status(200).json(set);
};

// @desc    Update flashcard set
// @route   PUT /api/flashcards/:id
// @access  Private
const updateFlashcardSet = async (req, res) => {
  const { id } = req.params;
  const { title, cards } = req.body;

  const set = await prisma.flashcardSet.findUnique({
    where: { id },
    include: { cards: true },
  });

  if (!set) {
    return res.status(404).json({ message: 'Set not found' });
  }

  if (set.userId !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  // Update set title
  const updatedSet = await prisma.flashcardSet.update({
    where: { id },
    data: { title },
  });

  // If cards are provided, update them
  if (cards && Array.isArray(cards)) {
    // Delete existing cards
    await prisma.flashcard.deleteMany({
      where: { setId: id },
    });

    // Create new cards
    if (cards.length > 0) {
      await prisma.flashcard.createMany({
        data: cards.map(card => ({
          front: card.front,
          back: card.back,
          setId: id,
        })),
      });
    }
  }

  // Fetch updated set with cards
  const finalSet = await prisma.flashcardSet.findUnique({
    where: { id },
    include: { cards: true },
  });

  res.status(200).json(finalSet);
};

// @desc    Get cards due for review
// @route   GET /api/flashcards/due
// @access  Private
const getDueCards = async (req, res) => {
  const now = new Date();
  
  const dueCards = await prisma.flashcard.findMany({
    where: {
      set: {
        userId: req.user.id,
      },
      OR: [
        { nextReview: null },
        { nextReview: { lte: now } },
      ],
    },
    include: {
      set: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  res.status(200).json(dueCards);
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
  getFlashcardSet,
  createFlashcardSet,
  updateFlashcardSet,
  getDueCards,
  addCardToSet,
  deleteFlashcardSet,
};
