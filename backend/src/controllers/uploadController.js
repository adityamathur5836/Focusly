const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdf = require('pdf-parse');
const prisma = require('../utils/prisma');
const { generateDetailedNotes, generateQuickNotes, generateFlashcards } = require('../utils/aiService');
const handleDbError = require('../utils/handleDbError');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.txt', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, TXT, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE_MB || 50) * 1024 * 1024
  }
});

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    if (data.info && data.info.IsEncrypted) {
      throw new Error('PDF is encrypted or password protected');
    }

    console.log(`PDF extraction: ${data.numpages} pages, ${data.text.length} characters`);

    const trimmedText = data.text ? data.text.trim() : '';

    if (trimmedText.length >= 100) {
      console.log('✓ Standard text extraction successful');
      return trimmedText;
    }

    console.log('⚠ Minimal text extracted, attempting OCR...');
    const { extractTextWithOCR } = require('./ocrService');

    try {
      const ocrResult = await extractTextWithOCR(filePath, 10);

      if (ocrResult.text && ocrResult.text.trim().length >= 50) {
        console.log(`✓ OCR extraction successful (${ocrResult.pagesProcessed} pages, ${ocrResult.confidence.toFixed(1)}% confidence)`);
        return ocrResult.text;
      } else {
        throw new Error('OCR extraction returned insufficient text');
      }
    } catch (ocrError) {
      console.error('OCR extraction failed:', ocrError);
      throw new Error('This PDF appears to be image-based or scanned, but OCR extraction failed. The file might be corrupted or contain only images without readable text.');
    }
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error.message.includes('encrypted') || error.message.includes('password')) {
      throw new Error('PDF is encrypted or password protected. Please use an unencrypted PDF.');
    }
    if (error.message.includes('OCR')) {
      throw error;
    }
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};


const extractTextFromTXT = async (filePath) => {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    console.log(`TXT extraction: ${text.length} characters`);
    return text;
  } catch (error) {
    console.error('TXT extraction error:', error);
    throw new Error(`Failed to read TXT file: ${error.message}`);
  }
};

const uploadAndGenerateNotes = async (req, res) => {
  try {
    const geminiApiKey = process.env.GEMINI_API;
    if (!geminiApiKey || geminiApiKey.trim() === '') {
      return res.status(500).json({
        message: 'Gemini API key is not configured. Please add GEMINI_API environment variable in Render dashboard.',
        error: 'GEMINI_API_NOT_SET',
        instructions: 'Go to Render Dashboard → Your Service → Environment → Add GEMINI_API variable with your Google AI Studio API key'
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { mode } = req.body;
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text;
    try {
      console.log(`Processing file: ${req.file.originalname}, extension: ${ext}`);

      if (ext === '.pdf') {
        text = await extractTextFromPDF(filePath);
      } else if (ext === '.txt') {
        text = await extractTextFromTXT(filePath);
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: 'DOC/DOCX support coming soon. Please use PDF or TXT.' });
      }
    } catch (extractError) {
      console.error('Error extracting text:', extractError);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      let errorMessage = 'Failed to extract text from file.';
      if (extractError.message.includes('encrypted') || extractError.message.includes('password')) {
        errorMessage = 'This PDF is encrypted or password protected. Please use an unencrypted PDF.';
      } else if (extractError.message.includes('OCR')) {
        errorMessage = extractError.message;
      } else if (ext === '.pdf') {
        errorMessage = 'Failed to extract text from PDF. Please ensure the file is not corrupted and contains readable text.';
      } else {
        errorMessage = `Failed to read file: ${extractError.message}`;
      }

      return res.status(400).json({ message: errorMessage });
    }

    const trimmedText = text ? text.trim() : '';
    console.log(`Extracted text length: ${trimmedText.length} characters`);

    if (!trimmedText || trimmedText.length < 50) {
      fs.unlinkSync(filePath);

      let errorMessage;
      if (!trimmedText || trimmedText.length === 0) {
        errorMessage = ext === '.pdf'
          ? 'No text could be extracted from this PDF. It might be a scanned document without OCR, an image-based PDF, or contain only images. Please try a text-based PDF or use OCR software first.'
          : 'The file appears to be empty. Please ensure the file contains readable text.';
      } else {
        errorMessage = `Insufficient text extracted (${trimmedText.length} characters). Please ensure the file contains at least 50 characters of readable text.`;
      }

      return res.status(400).json({ message: errorMessage });
    }

    text = trimmedText;

    let generatedContent;
    try {
      console.log('Starting notes generation...');
      console.log('Text length:', text.length);
      console.log('Mode:', mode);
      console.log('GEMINI_API configured:', !!process.env.GEMINI_API);
      
      if (mode === 'detailed') {
        generatedContent = await generateDetailedNotes(text);
      } else {
        generatedContent = await generateQuickNotes(text);
      }
      
      if (!generatedContent || generatedContent.trim().length === 0) {
        throw new Error('Generated notes content is empty');
      }
      
      console.log(`✓ Generated notes successfully, length: ${generatedContent.length}`);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      console.error('Error stack:', aiError.stack);
      
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to generate notes with AI.';
      if (aiError.message.includes('API key') || aiError.message.includes('not configured')) {
        errorMessage = 'Gemini API key is not configured. Please add GEMINI_API to your environment variables.';
      } else if (aiError.message.includes('quota') || aiError.message.includes('rate limit')) {
        errorMessage = 'API quota exceeded. Please check your Gemini API usage limits.';
      } else if (aiError.message.includes('authentication') || aiError.message.includes('unauthorized')) {
        errorMessage = 'Invalid API key. Please verify your GEMINI_API environment variable is correct.';
      } else {
        errorMessage = `Failed to generate notes: ${aiError.message}`;
      }
      
      return res.status(500).json({
        message: errorMessage,
        error: aiError.message,
        details: process.env.NODE_ENV === 'development' ? aiError.stack : undefined
      });
    }

    const titleMatch = generatedContent.match(/^#\s*(.+)$/m) || generatedContent.match(/^(.+)$/m);
    const title = titleMatch ? titleMatch[1].replace(/^#+\s*/, '').trim() : `Notes from ${req.file.originalname}`;

    console.log('Creating note in database...');
    console.log('User ID:', req.user.id);
    console.log('Title:', title);
    console.log('Content length:', generatedContent.length);

    const note = await prisma.note.create({
      data: {
        title,
        content: generatedContent,
        tags: `ai-generated,${mode}`,
        userId: req.user.id,
      },
    });

    console.log('Note created successfully:', {
      id: note.id,
      title: note.title,
      userId: note.userId,
      createdAt: note.createdAt
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Notes generated successfully',
      note,
    });
  } catch (error) {
    console.error('Error processing file:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.message && error.message.includes('authentication failed')) {
      return handleDbError(error, res, 'Failed to process file and generate notes');
    }
    res.status(500).json({
      message: 'Failed to process file and generate notes',
      error: error.message
    });
  }
};

const uploadAndGenerateFlashcards = async (req, res) => {
  try {
    const geminiApiKey = process.env.GEMINI_API;
    if (!geminiApiKey || geminiApiKey.trim() === '') {
      return res.status(500).json({
        message: 'Gemini API key is not configured. Please add GEMINI_API environment variable in Render dashboard.',
        error: 'GEMINI_API_NOT_SET',
        instructions: 'Go to Render Dashboard → Your Service → Environment → Add GEMINI_API variable with your Google AI Studio API key'
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text;
    try {
      console.log(`Processing file: ${req.file.originalname}, extension: ${ext}`);

      if (ext === '.pdf') {
        text = await extractTextFromPDF(filePath);
      } else if (ext === '.txt') {
        text = await extractTextFromTXT(filePath);
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: 'DOC/DOCX support coming soon. Please use PDF or TXT.' });
      }
    } catch (extractError) {
      console.error('Error extracting text:', extractError);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      let errorMessage = 'Failed to extract text from file.';
      if (extractError.message.includes('encrypted') || extractError.message.includes('password')) {
        errorMessage = 'This PDF is encrypted or password protected. Please use an unencrypted PDF.';
      } else if (extractError.message.includes('OCR')) {
        errorMessage = extractError.message;
      } else if (ext === '.pdf') {
        errorMessage = 'Failed to extract text from PDF. Please ensure the file is not corrupted and contains readable text.';
      } else {
        errorMessage = `Failed to read file: ${extractError.message}`;
      }

      return res.status(400).json({ message: errorMessage });
    }

    const trimmedText = text ? text.trim() : '';
    console.log(`Extracted text length: ${trimmedText.length} characters`);

    if (!trimmedText || trimmedText.length < 50) {
      fs.unlinkSync(filePath);

      let errorMessage;
      if (!trimmedText || trimmedText.length === 0) {
        errorMessage = ext === '.pdf'
          ? 'No text could be extracted from this PDF. It might be a scanned document without OCR, an image-based PDF, or contain only images. Please try a text-based PDF or use OCR software first.'
          : 'The file appears to be empty. Please ensure the file contains readable text.';
      } else {
        errorMessage = `Insufficient text extracted (${trimmedText.length} characters). Please ensure the file contains at least 50 characters of readable text.`;
      }

      return res.status(400).json({ message: errorMessage });
    }

    text = trimmedText;

    let cards;
    try {
      console.log('Starting flashcard generation...');
      console.log('Text length:', text.length);
      console.log('GEMINI_API configured:', !!process.env.GEMINI_API);
      
      cards = await generateFlashcards(text);
      
      if (!cards || !Array.isArray(cards)) {
        throw new Error('Generated flashcards is not a valid array');
      }
      
      console.log(`✓ Generated ${cards.length} flashcards successfully`);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      console.error('Error stack:', aiError.stack);
      
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to generate flashcards with AI.';
      if (aiError.message.includes('API key') || aiError.message.includes('not configured')) {
        errorMessage = 'Gemini API key is not configured. Please add GEMINI_API to your environment variables.';
      } else if (aiError.message.includes('quota') || aiError.message.includes('rate limit')) {
        errorMessage = 'API quota exceeded. Please check your Gemini API usage limits.';
      } else if (aiError.message.includes('authentication') || aiError.message.includes('unauthorized')) {
        errorMessage = 'Invalid API key. Please verify your GEMINI_API environment variable is correct.';
      } else {
        errorMessage = `Failed to generate flashcards: ${aiError.message}`;
      }
      
      return res.status(500).json({
        message: errorMessage,
        error: aiError.message,
        details: process.env.NODE_ENV === 'development' ? aiError.stack : undefined
      });
    }

    if (!cards || cards.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Could not generate flashcards from content. Please try a different file.' });
    }

    const setTitle = `Flashcards from ${req.file.originalname}`;
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title: setTitle,
        userId: req.user.id,
        cards: {
          create: cards.map(card => ({
            front: card.front,
            back: card.back,
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json({
      message: 'Flashcards generated successfully',
      set: flashcardSet,
    });
  } catch (error) {
    console.error('Error processing file:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.message && error.message.includes('authentication failed')) {
      return handleDbError(error, res, 'Failed to process file and generate flashcards');
    }
    res.status(500).json({
      message: 'Failed to process file and generate flashcards',
      error: error.message
    });
  }
};

const testFileExtraction = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let text;
    try {
      console.log(`Testing file: ${req.file.originalname}, extension: ${ext}`);

      if (ext === '.pdf') {
        text = await extractTextFromPDF(filePath);
      } else if (ext === '.txt') {
        text = await extractTextFromTXT(filePath);
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: 'Only PDF and TXT files are supported for testing.' });
      }
    } catch (extractError) {
      console.error('Error extracting text:', extractError);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      return res.status(400).json({
        message: 'Failed to extract text from file.',
        error: extractError.message,
        details: extractError.stack
      });
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const trimmedText = text ? text.trim() : '';

    res.status(200).json({
      success: true,
      filename: req.file.originalname,
      fileSize: req.file.size,
      extension: ext,
      extractedLength: trimmedText.length,
      hasEnoughText: trimmedText.length >= 50,
      preview: trimmedText.substring(0, 500) + (trimmedText.length > 500 ? '...' : ''),
      message: trimmedText.length >= 50
        ? 'Text extraction successful! This file should work for generating notes/flashcards.'
        : `Text extraction successful but insufficient content (${trimmedText.length} characters). Need at least 50 characters.`
    });
  } catch (error) {
    console.error('Error testing file:', error);

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: 'Failed to test file extraction',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  uploadAndGenerateNotes,
  uploadAndGenerateFlashcards,
  testFileExtraction,
};
