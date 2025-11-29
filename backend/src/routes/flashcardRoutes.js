const express = require('express');
const router = express.Router();
const {
  getFlashcardSets,
  createFlashcardSet,
  addCardToSet,
  deleteFlashcardSet,
} = require('../controllers/flashcardController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFlashcardSets).post(protect, createFlashcardSet);
router.route('/:id').delete(protect, deleteFlashcardSet);
router.route('/:setId/cards').post(protect, addCardToSet);

module.exports = router;
