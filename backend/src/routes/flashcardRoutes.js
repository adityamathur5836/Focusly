const express = require('express');
const router = express.Router();
const {
  getFlashcardSets,
  getFlashcardSet,
  createFlashcardSet,
  updateFlashcardSet,
  getDueCards,
  addCardToSet,
  deleteFlashcardSet,
  deleteCard,
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFlashcardSets);
router.get('/due', protect, getDueCards);
router.get('/:id', protect, getFlashcardSet);
router.post('/', protect, createFlashcardSet);
router.put('/:id', protect, updateFlashcardSet);
router.delete('/:id', protect, deleteFlashcardSet);
router.post('/:setId/cards', protect, addCardToSet);
router.delete('/:setId/cards/:cardId', protect, deleteCard);

module.exports = router;
