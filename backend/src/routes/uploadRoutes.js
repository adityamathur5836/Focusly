const express = require('express');
const router = express.Router();
const { upload, uploadAndGenerateNotes, uploadAndGenerateFlashcards, testFileExtraction } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/notes', protect, upload.single('file'), uploadAndGenerateNotes);
router.post('/flashcards', protect, upload.single('file'), uploadAndGenerateFlashcards);
router.post('/test', protect, upload.single('file'), testFileExtraction);

module.exports = router;

