const prisma = require('../utils/prisma');

const getFlashcardSets = async (req, res) => {
  const sets = await prisma.flashcardSet.findMany({
    where: { userId: req.user.id },
    include: { cards: true },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json(sets);
};

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

  const updatedSet = await prisma.flashcardSet.update({
    where: { id },
    data: { title },
  });

  if (cards && Array.isArray(cards)) {
    await prisma.flashcard.deleteMany({
      where: { setId: id },
    });

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

  const finalSet = await prisma.flashcardSet.findUnique({
    where: { id },
    include: { cards: true },
  });

  res.status(200).json(finalSet);
};

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
